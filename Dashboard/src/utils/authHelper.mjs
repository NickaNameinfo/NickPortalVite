import { getCookie } from "../JsFiles/CommonFunction.mjs";

/**
 * Public routes that don't require authentication
 * These routes should NOT have Authorization headers
 */
const PUBLIC_ROUTES = [
  '/auth/register',
  '/auth/rootLogin',
  '/customer/register',
  '/customer/login',
];

/**
 * Check if a route is public (doesn't require authentication)
 * @param {string} url - API endpoint URL
 * @returns {boolean} True if route is public
 */
const isPublicRoute = (url) => {
  if (!url) return false;
  
  // Remove base URL and query params, normalize path
  const path = url.split('?')[0].replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
  
  // Check exact match
  if (PUBLIC_ROUTES.includes(path)) {
    return true;
  }
  
  // Check if path starts with any public route
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
};

/**
 * Get authentication token from cookies (internal function)
 * Backend checks for 'XSRF-token' cookie or 'token' cookie
 * Also checks 'auth' cookie as fallback (backend may set token in auth cookie)
 * @returns {string|null} Token or null
 */
const getAuthTokenInternal = () => {
  console.log('34523452343252345324fwfdfasd', getCookie("XSRF-token"), getCookie("token"));
  // Backend middleware checks for 'XSRF-token' cookie first, then 'token'
  let token = getCookie("XSRF-token") || getCookie("token");
  
  // If not found, check 'auth' cookie (backend may set token there)
  if (!token) {
    const authCookie = getCookie("auth");
    if (authCookie) {
      try {
        // auth cookie is URL-encoded JSON string
        const authData = JSON.parse(decodeURIComponent(authCookie));
        token = authData?.token || authData?.data?.token;
        
        if (token && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.log('[Auth] Token extracted from auth cookie');
        }
      } catch (e) {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.warn('[Auth] Failed to parse auth cookie:', e);
        }
      }
    }
  }
    return token;
};

/**
 * Get authentication headers for API requests
 * @param {string} url - API endpoint URL (optional, for public route detection)
 * @returns {Object} Headers object with Authorization if token exists and route is not public
 */
export const getAuthHeaders = (url = '') => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Don't add auth header for public routes
  if (isPublicRoute(url)) {
    return headers;
  }
  
  const token = getAuthTokenInternal();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Map endpoint names to their URL paths for public route detection
 * This helps identify public routes when only endpoint name is available
 */
const PUBLIC_ENDPOINT_NAMES = ['Login', 'Register'];

/**
 * Prepare headers for RTK Query (fetchBaseQuery)
 * Matches backend middleware behavior:
 * - Checks for XSRF-token cookie first, then token cookie
 * - Adds Authorization header with Bearer token
 * - Skips auth for public routes
 * @param {Headers} headers - Headers object from fetchBaseQuery
 * @param {Object} api - API context from RTK Query
 * @returns {Headers} Headers with authentication
 */
export const prepareHeaders = (headers, api) => {
  // Extract URL from api.arg (the query function result)
  const url = api?.arg?.url || '';
  
  // Check if this is a file upload endpoint
  const isUploadEndpoint = url.includes('/upload-file') || url.includes('/upload');
  
  // Check if body is FormData - if so, don't set Content-Type
  // Browser will automatically set it with boundary parameter for multipart/form-data
  const body = api?.arg?.body;
  
  // Multiple ways to detect FormData (in case instanceof doesn't work in some contexts)
  const isFormData = body instanceof FormData || 
                    (body && typeof body === 'object' && body.constructor?.name === 'FormData') ||
                    (body && typeof body.append === 'function' && typeof body.get === 'function');
  
  // Debug logging for FormData detection
  if ((isFormData || isUploadEndpoint) && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Auth] FormData/Upload detection:', {
      isFormData,
      isUploadEndpoint,
      url,
      bodyType: typeof body,
      constructorName: body?.constructor?.name,
      hasAppend: typeof body?.append === 'function',
    });
  }
  
  // Only set Content-Type if it's NOT FormData and NOT upload endpoint
  // Don't modify Content-Type here - it needs the boundary parameter for FormData
  if (isFormData || isUploadEndpoint) {
    // Remove Content-Type if it was set, let browser set it with boundary
    if (headers.has("Content-Type")) {
      headers.delete("Content-Type");
    }
    // Don't set any Content-Type - browser will set multipart/form-data with boundary automatically
  } else if (!headers.has("Content-Type")) {
    // Only set Content-Type for non-FormData requests
    headers.set("Content-Type", "application/json");
  }
  
  // Extract endpoint name from RTK Query api object
  // api structure: { getState, endpoint, type, forced, arg, extra }
  const endpoint = api?.endpoint;
  
  // Check if this is a public endpoint by name
  // RTK Query endpoint names match the exported hook names (e.g., 'Login', 'Register')
  // Backend public routes: /auth/register, /auth/rootLogin, /customer/register, /customer/login
  if (endpoint && PUBLIC_ENDPOINT_NAMES.includes(endpoint)) {
    // Don't add auth for public routes (Login, Register)
    // Backend middleware will allow these without authentication
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[Auth] Public endpoint detected: ${endpoint} - Skipping auth`);
    }
    return headers;
  }
  
  // Also check URL path for public routes (double-check)
  if (url && isPublicRoute(url)) {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[Auth] Public route detected by URL: ${url} - Skipping auth`);
    }
    return headers;
  }
  
  // For all other endpoints, add authentication token
  // ALL endpoints in Service.mjs will reach here and get tokens added
  // Backend middleware checks:
  // 1. Cookie: req.cookies['XSRF-token'] (preferred)
  // 2. Header: req.headers['authorization'] (fallback)
  const token = getAuthTokenInternal();
  
  if (token) {
    // Backend expects: Authorization: Bearer <token>
    // Note: Backend checks req.headers['authorization'] (lowercase)
    // But HTTP headers are case-insensitive, so 'Authorization' is fine
    headers.set("Authorization", `${token}`);
    
    // Debug logging in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[Auth] ✅ Token added for endpoint: ${endpoint || 'unknown'} | URL: ${url || 'unknown'}`);
    }
  } else {
    // No token available - backend will return 401
    // This is expected behavior for unauthenticated requests to protected routes
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn(`[Auth] ⚠️ No token found for endpoint: ${endpoint || 'unknown'} | URL: ${url || 'unknown'}. Backend will return 401.`);
      console.warn(`[Auth] Available cookies:`, document.cookie);
    }
  }
  
  return headers;
};

/**
 * Check if user is authenticated
 * Backend checks for 'XSRF-token' or 'token' cookie
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  const token = getAuthTokenInternal();
  return token !== null && token !== undefined && token !== "";
};

/**
 * Get authentication token (exported for external use)
 * Backend middleware checks for 'XSRF-token' cookie first, then 'token'
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  return getAuthTokenInternal();
};
