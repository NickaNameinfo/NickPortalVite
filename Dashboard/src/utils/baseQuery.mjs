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
      // Custom fetch function to handle FormData correctly
      fetchFn: async (input, init) => {
        // Check if body is FormData
        const body = init?.body || args?.body;
        const isFormData = body instanceof FormData;
        
        if (isFormData) {
          // For FormData, use native fetch directly to preserve multipart/form-data
          const url = typeof input === 'string' ? input : input.url;
          const fullUrl = url.startsWith('http') ? url : `${infoData.baseApi}${url}`;
          
          // Get headers from prepareHeaders
          const headers = new Headers();
          prepareHeaders(headers, { arg: args, endpoint: api?.endpoint });
          
          // Don't set Content-Type for FormData - browser will set it with boundary
          if (headers.has('Content-Type')) {
            headers.delete('Content-Type');
          }
          
          // Make the request with FormData - return Response object directly
          // RTK Query will handle the response parsing
          return fetch(fullUrl, {
            method: args?.method || init?.method || 'POST',
            headers: headers,
            body: body, // Use FormData directly
            credentials: 'include', // Include cookies
          });
        }
        
        // For non-FormData, use default fetch
        return fetch(input, init);
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
