import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers, { getState }) => {
    const token = getCookie("token"); // Assuming getCookie is a function to retrieve the token from cookies
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

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
