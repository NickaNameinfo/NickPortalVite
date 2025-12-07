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
        params: {
          currentLocation: localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')
        },
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
        url: `/store/list/${id}`,
        params: {
          currentLocation: localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')
        },
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
        url: `/store/filterByCategory`,
        params: {
          categoryIds: id,
          currentLocation: localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')
        },
        method: "GET",
      }),
    }),
    getStoresByFilters: builder.query({
      query: (query) => ({
        url: `/store/getAllStoresByFilters`,
        params: {
          search: query,
          currentLocation: localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')
        },
        method: "GET",
      }),
    }),
    getStoresByPaymentType: builder.query({
      query: (query) => ({
        url: `/store/getAllStoresByFilters`,
        params: {
          paymentModes: query,
          currentLocation: localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')
        },
        method: "GET",
      }),
    }),
    getStoresByOpenStore: builder.query({
      query: (query) => ({
        url: `/store/getOpenStores`,
        params: {
          currentLocation: localStorage.getItem('latitude') + ',' + localStorage.getItem('longitude')
        },
        method: "GET",
      }),
    }),
    updateProduct: builder.mutation({
      query: (body) => ({
        url: `/product/update`,
        method: "POST",
        body,
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
    // Product Feedback endpoints
    addProductFeedback: builder.mutation({
      query: (body) => ({
        url: `/productFeedback/create`,
        method: "POST",
        body,
      }),
    }),
    getProductFeedbackById: builder.query({
      query: (id) => ({
        url: `/productFeedback/list/${id}`,
        method: "GET",
      }),
    }),
    updateProductFeedback: builder.mutation({
      query: (body) => ({
        url: `/productFeedback/update`,
        method: "POST",
        body,
      }),
    }),
    deleteProductFeedback: builder.mutation({
      query: (id) => ({
        url: `/productFeedback/delete/${id}`,
        method: "DELETE",
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
  useUpdateProductMutation,
  useAddProductFeedbackMutation,
  useGetProductFeedbackByIdQuery,
  useUpdateProductFeedbackMutation,
  useDeleteProductFeedbackMutation,
} = StoreApi;
export const { endpoints } = StoreApi;
