/**
 * API Error Handler Utility
 * Handles different types of API errors with user-friendly messages
 */

/**
 * Handle API errors and return user-friendly error information
 * @param {Object} error - Error object from RTK Query or fetch
 * @returns {Object} Error information with message, type, and action
 */
export const handleApiError = (error) => {
  // Network error (no response)
  if (!error || !error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      status: null,
    };
  }

  const { status, data } = error.response;

  // Parse error response structure
  // Backend returns: { success: false, message: "...", error: "..." }
  const errorMessage = data?.message || data?.error || 'An error occurred';
  const errors = data?.errors || [];

  switch (status) {
    case 401:
      return {
        message: errorMessage || 'Authentication required. Please login again.',
        type: 'auth',
        status: 401,
        action: 'redirect', // Redirect to login
        errors: errors,
      };
    
    case 403:
      return {
        message: errorMessage || 'You do not have permission to access this resource.',
        type: 'permission',
        status: 403,
        errors: errors,
      };
    
    case 404:
      return {
        message: errorMessage || 'Resource not found.',
        type: 'notFound',
        status: 404,
        errors: errors,
      };
    
    case 429:
      return {
        message: errorMessage || 'Too many requests. Please try again later.',
        type: 'rateLimit',
        status: 429,
        retryAfter: data?.retryAfter, // seconds
        retryAt: data?.retryAfter ? new Date(Date.now() + data.retryAfter * 1000) : null,
        errors: errors,
      };
    
    case 400:
      return {
        message: errorMessage || 'Invalid request. Please check your input.',
        type: 'validation',
        status: 400,
        errors: errors,
      };
    
    case 500:
    case 502:
    case 503:
      return {
        message: errorMessage || 'Server error. Please try again later.',
        type: 'server',
        status: status,
        errors: errors,
      };
    
    default:
      return {
        message: errorMessage || 'An error occurred. Please try again.',
        type: 'unknown',
        status: status,
        errors: errors,
      };
  }
};

/**
 * Handle rate limiting errors
 * @param {Object} error - Error object
 * @returns {Object|null} Rate limit information or null
 */
export const handleRateLimit = (error) => {
  if (error?.response?.status === 429) {
    const data = error.response.data;
    return {
      message: data?.message || 'Too many requests. Please try again later.',
      retryAfter: data?.retryAfter, // seconds
      retryAt: data?.retryAfter ? new Date(Date.now() + data.retryAfter * 1000) : null,
    };
  }
  return null;
};

/**
 * Check if error is authentication related
 * @param {Object} error - Error object
 * @returns {boolean} True if error is 401
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401 || error?.status === 401;
};

/**
 * Check if error is rate limit related
 * @param {Object} error - Error object
 * @returns {boolean} True if error is 429
 */
export const isRateLimitError = (error) => {
  return error?.response?.status === 429 || error?.status === 429;
};

/**
 * Format error message for display
 * @param {Object} error - Error object
 * @param {boolean} showDetails - Show detailed error messages
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error, showDetails = false) => {
  const errorInfo = handleApiError(error);
  
  if (showDetails && errorInfo.errors && errorInfo.errors.length > 0) {
    // Show validation errors if available
    const validationErrors = errorInfo.errors
      .map(err => typeof err === 'string' ? err : err.message || JSON.stringify(err))
      .join(', ');
    return `${errorInfo.message} ${validationErrors}`;
  }
  
  return errorInfo.message;
};
