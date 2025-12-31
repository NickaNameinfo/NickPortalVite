import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();

/**
 * Global API Service
 * All endpoints in this service require authentication.
 * Tokens are automatically added via baseQuery -> prepareHeaders.
 * 
 * Token source: XSRF-token or token cookie
 * Token format: Authorization: Bearer <token>
 */
export const GlobalApi = createApi({
  reducerPath: "globalApi",
  baseQuery: axiosBaseQuery, // Uses createBaseQuery() which adds auth headers
  endpoints: (builder) => ({
    /**
     * Get user by ID
     * Requires: Authentication token
     * URL: GET /auth/user/:id
     */
    getUser: builder.query({
      query: (id) => ({
        url: `/auth/user/${id}`,
        method: "GET",
      }),
    }),
    /**
     * Get all users list
     * Requires: Authentication token
     * URL: GET /auth/user/getAllUserList
     */
    getAllUser: builder.query({
      query: (id) => ({
        url: `/auth/user/getAllUserList`,
        method: "GET",
      }),
    }),
    /**
     * Get all orders list
     * Requires: Authentication token
     * URL: GET /order/list
     */
    getAllOrderList: builder.query({
      query: (id) => ({
        url: `/order/list`,
        method: "GET",
      }),
    }),
    /**
     * Get orders by store ID
     * Requires: Authentication token
     * URL: GET /order/store/list/:id
     */
    getAllOrderListByStore: builder.query({
      query: (id) => ({
        url: `/order/store/list/${id}`,
        method: "GET",
      }),
    }),
    /**
     * Update user
     * Requires: Authentication token
     * URL: POST /auth/user/update
     */
    updatUser: builder.mutation({
      query: (body) => ({
        url: `/auth/user/update`,
        method: "POST",
        body
      }),
    }),
    /**
     * Update order status
     * Requires: Authentication token
     * URL: POST /order/status/update
     */
    updatOrder: builder.mutation({
      query: (body) => ({
        url: `/order/status/update`,
        method: "POST",
        body
      }),
    }),
    /**
     * Upload file
     * Requires: Authentication token
     * URL: POST /auth/upload-file
     */
    uploadFile: builder.mutation({
      query: (body) => ({
        url: `/auth/upload-file`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const { useGetUserQuery,useUpdatUserMutation, useGetAllUserQuery, useGetAllOrderListQuery, useGetAllOrderListByStoreQuery, useUpdatOrderMutation, useUploadFileMutation } = GlobalApi;
export const { endpoints } = GlobalApi;
