import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const VendorProductApi = createApi({
  reducerPath: "VendorProductApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: (body) => ({
        url: `/vendor/list`,
        method: "GET",
      }),
    }),
    getVendorsById: builder.query({
      query: (id) => ({
        url: `/vendor/list/${id}`,
        method: "GET",
      }),
    }),
    getVendorsProductById: builder.query({
      query: (id) => ({
        url: `/vendor/product/getAllProductById/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetVendorsQuery, useGetVendorsByIdQuery, useGetVendorsProductByIdQuery } = VendorProductApi;
export const { endpoints } = VendorProductApi;
