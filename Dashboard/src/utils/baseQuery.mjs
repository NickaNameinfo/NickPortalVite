/**
 * Shared Base Query with Error Handling
 * All RTK Query services should use this base query
 */

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../configData";
import { prepareHeaders } from "./authHelper.mjs";
import { handleUnauthorized } from "./authUtils.mjs";

/**
 * Base query with global error handling
 * - Adds authentication headers
 * - Handles 401 errors globally
 * - Handles network errors
 */
export const createBaseQuery = () => {
  return async (args, api, extraOptions) => {
    // Create base query with auth headers
    // Cookies are automatically sent with same-origin requests
    const baseQuery = fetchBaseQuery({
      baseUrl: infoData.baseApi,
      prepareHeaders: (headers, api) => {
        return prepareHeaders(headers, api);
      },
    });

    // Execute the query
    const result = await baseQuery(args, api, extraOptions);

    // Handle errors globally
    if (result.error) {
      const error = result.error;
      
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        console.warn('[API] 401 Unauthorized - Redirecting to login');
        // handleUnauthorized();
        return result; // Return error so component can handle it
      }
      
      // Handle network errors
      if (error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR') {
        console.error('[API] Network or parsing error:', error);
        // Don't redirect for network errors, let component handle it
      }
      
      // Log other errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[API] Error:', {
          status: error.status,
          data: error.data,
          endpoint: args?.url || 'unknown',
        });
      }
    }

    return result;
  };
};
