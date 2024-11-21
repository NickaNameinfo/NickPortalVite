import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const StoreApi = createApi({
  reducerPath: "StoreApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getStoresProductByID: builder.query({
      query: (id) => ({
        url: `/store/product/getAllProductById/${id}`,
        method: "GET",
      }),
    }),
    getStores: builder.query({
      query: (id) => ({
        url: `/store/list`,
        method: "GET",
      }),
    }),
    getStoresById: builder.query({
      query: (id) => ({
        url: `/store/list/${id}`,
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
    getStoresByCategory:  builder.query({
      query: (id) => ({
        url: `/store/filterByCategory?categoryIds=${id}`,
        method: "GET",
      }),
    }),
    getStoresByFilters:  builder.query({
      query: (query) => ({
        url: `/store/getAllStoresByFilters?search=${query}`,
        method: "GET",
      }),
    }),
    getStoresByPaymentType:  builder.query({
      query: (query) => ({
        url: `/store/getAllStoresByFilters?paymentModes=${query}`,
        method: "GET",
      }),
    }),
    getStoresByOpenStore:  builder.query({
      query: (query) => ({
        url: `/store/getOpenStores`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetStoresProductByIDQuery,
  useGetStoresQuery,
  useAddCartMutation,
  useDeleteCartItemMutation,
  useGetCartByOrderIdQuery,
  useGetCartByProductIdQuery,
  useUpdateCartMutation,
  useGetStoresByIdQuery,
  useGetStoresByCategoryQuery,
  useGetStoresByFiltersQuery,
  useGetStoresByPaymentTypeQuery,
  useGetStoresByOpenStoreQuery,
  useAddOrderMutation
} = StoreApi;
export const { endpoints } = StoreApi;
