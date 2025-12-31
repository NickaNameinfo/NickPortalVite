/**
 * Authentication Utilities
 * Helper functions for authentication management
 */

import { eraseCookie, getCookie } from "../JsFiles/CommonFunction.mjs";
import { getAuthToken } from "./authHelper.mjs";

/**
 * Clear all authentication data
 * Removes tokens and user data from cookies and localStorage
 */
export const clearAuthData = () => {
  // Clear cookies
  eraseCookie("XSRF-token");
  eraseCookie("token");
  eraseCookie("id");
  eraseCookie("role");
  eraseCookie("vendorId");
  eraseCookie("storeId");
  eraseCookie("plan");
  
  // Clear localStorage if used
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginDetails');
  }
  
  console.log('[Auth] All authentication data cleared');
};

/**
 * Logout user
 * Clears auth data and redirects to login
 * @param {Function} navigate - Navigation function (optional)
 */
export const logout = (navigate = null) => {
  // Clear all authentication data
  clearAuthData();
  
  // Redirect to login
  if (navigate) {
    navigate("/");
  } else if (typeof window !== 'undefined') {
    window.location.href = "/";
  }
};

/**
 * Handle unauthorized access (401 error)
 * Clears auth and redirects to login
 * @param {Function} navigate - Navigation function (optional)
 */
export const handleUnauthorized = (navigate = null) => {
  console.warn('[Auth] Unauthorized access detected. Logging out...');
  logout(navigate);
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user has valid token
 */
export const isLoggedIn = () => {
  const token = getAuthToken();
  return token !== null && token !== undefined && token !== "";
};

/**
 * Get user ID from cookies
 * @returns {string|null} User ID or null
 */
export const getUserId = () => {
  return getCookie("id");
};

/**
 * Get user role from cookies
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  return getCookie("role");
};
