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
    getCartByProductId: builder.query({
      query: (body) => ({
        url: `/cart/list/${body?.id}/${body?.productId}`,
        method: "GET",
      }),
    }),
    addCart: builder.mutation({
      query: (body) => ({
        url: `/cart/create`,
        method: "POST",
        body,
      }),
    }),
    updateCart: builder.mutation({
      query: (body) => ({
        url: `/cart/update/${body?.orderId}/${body?.productId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorsByIdQuery,
  useGetVendorsProductByIdQuery,
  useAddCartMutation,
  useGetCartByProductIdQuery,
  useUpdateCartMutation
} = VendorProductApi;
export const { endpoints } = VendorProductApi;
