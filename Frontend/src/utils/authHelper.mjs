import { getCookie } from "../JsFiles/CommonFunction.mjs";

/**
 * Get authentication headers for API requests
 * Checks both localStorage and cookies for token
 * @returns {Object} Headers object with Authorization if token exists
 */
export const getAuthHeaders = () => {
  // Check localStorage first, then cookies
  const token = localStorage.getItem('token') || getCookie('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Prepare headers for RTK Query (fetchBaseQuery)
 * Adds Authorization header if token exists
 * @param {Headers} headers - Headers object from fetchBaseQuery
 * @param {Object} getState - Redux getState function (optional)
 * @returns {Headers} Headers with authentication
 */
export const prepareHeaders = (headers, { getState } = {}) => {
  // Check localStorage first, then cookies
  const token = localStorage.getItem('token') || getCookie('token');
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Always set Content-Type
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  return headers;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token') || getCookie('token');
  return token !== null && token !== undefined && token !== "";
};

/**
 * Get authentication token
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('token') || getCookie('token');
};
