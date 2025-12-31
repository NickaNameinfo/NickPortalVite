import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();
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
    getCartByOrderId: builder.query({
      query: (id) => ({
        url: `/cart/list/${id}`,
        method: "GET",
      }),
    }),
    getOrderByOrderId: builder.query({
      query: (id) => ({
        url: `/order/list/${id}`,
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
    addOrder: builder.mutation({
      query: (body) => ({
        url: `/order/create`,
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
    deleteCartItem: builder.mutation({
      query: (body) => ({
        url: `/cart/delete/${body?.orderId}/${body?.productId}`,
        method: "DELETE",
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
  useAddOrderMutation,
  useGetCartByProductIdQuery,
  useUpdateCartMutation,
  useGetCartByOrderIdQuery,
  useGetOrderByOrderIdQuery,
  useDeleteCartItemMutation
} = VendorProductApi;
export const { endpoints } = VendorProductApi;
