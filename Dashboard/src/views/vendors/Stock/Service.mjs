import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();
export const VendorStockApi = createApi({
  reducerPath: "vendorStock",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    addStock: builder.mutation({
      query: (body) => ({
        url: `/vendorStock`,
        method: "POST",
        body,
      }),
    }),
    getStock: builder.query({
      query: (id) => ({
        url: `/vendorStock/${id}`,
        method: "GET",
      }),
    }),
    deleteStock: builder.mutation({
      query: (id) => ({
        url: `/vendorStock/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useAddStockMutation, useGetStockQuery, useDeleteStockMutation } =
  VendorStockApi;
export const { endpoints } = VendorStockApi;
