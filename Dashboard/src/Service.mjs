import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "./configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const GlobalApi = createApi({
  reducerPath: "globalApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => ({
        url: `/auth/user/${id}`,
        method: "GET",
      }),
    }),
    getAllUser: builder.query({
      query: (id) => ({
        url: `/auth/user/getAllUserList`,
        method: "GET",
      }),
    }),
    getAllOrderList: builder.query({
      query: (id) => ({
        url: `/order/list`,
        method: "GET",
      }),
    }),
    getAllOrderListByStore: builder.query({
      query: (id) => ({
        url: `/order/store/list/${id}`,
        method: "GET",
      }),
    }),
    updatUser: builder.mutation({
      query: (body) => ({
        url: `/auth/user/update`,
        method: "POST",
        body
      }),
    }),
    updatOrder: builder.mutation({
      query: (body) => ({
        url: `/order/status/update`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const { useGetUserQuery,useUpdatUserMutation, useGetAllUserQuery, useGetAllOrderListQuery, useGetAllOrderListByStoreQuery, useUpdatOrderMutation } = GlobalApi;
export const { endpoints } = GlobalApi;
