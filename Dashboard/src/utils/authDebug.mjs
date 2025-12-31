/**
 * Authentication Debugging Utility
 * Use this to debug authentication issues
 */

import { getCookie } from "../JsFiles/CommonFunction.mjs";

/**
 * Debug authentication status
 * Logs token presence and cookie values
 */
export const debugAuth = () => {
  if (typeof window === 'undefined') return;
  
  const xsrfToken = getCookie("XSRF-token");
  const token = getCookie("token");
  const id = getCookie("id");
  const role = getCookie("role");
  const authCookie = getCookie("auth");
  
  console.group('🔐 Authentication Debug');
  console.log('XSRF-token:', xsrfToken ? '✅ Present' : '❌ Missing', xsrfToken ? `(${xsrfToken.substring(0, 20)}...)` : '');
  console.log('token:', token ? '✅ Present' : '❌ Missing', token ? `(${token.substring(0, 20)}...)` : '');
  console.log('User ID:', id || '❌ Missing');
  console.log('Role:', role || '❌ Missing');
  
  // Check auth cookie if it exists
  if (authCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      const authToken = authData?.token || authData?.data?.token;
      const authId = authData?.user?._id || authData?.user?.id || authData?.id || authData?.data?.id;
      const authRole = authData?.user?.role || authData?.role || authData?.data?.role;
      
      console.log('auth cookie:', '✅ Present', {
        hasToken: !!authToken,
        hasUser: !!(authData?.user),
        success: authData?.success,
        token: authToken ? authToken.substring(0, 30) + '...' : '❌',
        id: authId || '❌',
        role: authRole || '❌',
      });
      
      // If XSRF-token/token cookies are missing but auth cookie has token, suggest extraction
      if (!xsrfToken && !token && authToken) {
        console.warn('⚠️ Token exists in auth cookie but not in XSRF-token/token cookies. Consider extracting it.');
      }
    } catch (e) {
      console.log('auth cookie:', '⚠️ Present but unparseable', e);
    }
  } else {
    console.log('auth cookie:', '❌ Missing');
  }
  
  console.log('All Cookies:', document.cookie);
  console.groupEnd();
  
  return {
    hasToken: !!(xsrfToken || token),
    xsrfToken: !!xsrfToken,
    token: !!token,
    id,
    role,
    authCookie: !!authCookie,
  };
};

/**
 * Check if authentication is working
 * Returns true if token is available (from XSRF-token, token, or auth cookie)
 */
export const checkAuth = () => {
  const xsrfToken = getCookie("XSRF-token");
  const token = getCookie("token");
  
  // Also check auth cookie
  if (!xsrfToken && !token) {
    const authCookie = getCookie("auth");
    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie));
        const authToken = authData?.token || authData?.data?.token;
        return !!authToken;
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  
  return !!(xsrfToken || token);
};
