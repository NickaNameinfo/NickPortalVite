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
        url: `/store/list?currentLocation=${localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')}`,
        method: "GET",
      }),
    }),
    addStore: builder.mutation({
      query: (body) => ({
        url: `/store/create`,
        method: "POST",
        body,
      }),
    }),
    getStoresById: builder.query({
      query: (id) => ({
        url: `/store/list/${id}?currentLocation=${localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')}`,
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
    addOrderlist: builder.mutation({
      query: (body) => ({
        url: `/payment/orderlist`,
        method: "POST",
        body,
      }),
    }),
    addPyament: builder.mutation({
      query: (body) => ({
        url: `/payment/orders`,
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
    getStoresByCategory: builder.query({
      query: (id) => ({
        url: `/store/filterByCategory?categoryIds=${id}`,
        method: "GET",
      }),
    }),
    getStoresByFilters: builder.query({
      query: (query) => ({
        url: `/store/getAllStoresByFilters?search=${query}`,
        method: "GET",
      }),
    }),
    getStoresByPaymentType: builder.query({
      query: (query) => ({
        url: `/store/getAllStoresByFilters?paymentModes=${query}`,
        method: "GET",
      }),
    }),
    getStoresByOpenStore: builder.query({
      query: (query) => ({
        url: `/store/getOpenStores`,
        method: "GET",
      }),
    }),
    addAddress: builder.mutation({
      query: (body) => ({
        url: `/address/create`,
        method: "POST",
        body,
      }),
    }),
    updateAddress: builder.mutation({
      query: (body) => ({
        url: `/address/update/${body?.id}`,
        method: "POST",
        body,
      }),
    }),
    deleteAddress: builder.mutation({
      query: (body) => ({
        url: `/address/delete/${body?.id}`,
        method: "DELETE",
      }),
    }),
    getAddressesByCustId: builder.query({
      query: (custId) => ({
        url: `/address/list/${custId}`,
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
  useAddOrderMutation,
  useAddStoreMutation,
  useGetOrderByOrderIdQuery,
  useUpdateAddressMutation,
  useGetAddressesByCustIdQuery,
  useAddAddressMutation,
  useAddOrderlistMutation,
  useAddPyamentMutation,
} = StoreApi;
export const { endpoints } = StoreApi;
