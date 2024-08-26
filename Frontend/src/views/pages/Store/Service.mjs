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
  useGetStoresProductByIDQuery,
  useGetStoresQuery,
  useAddCartMutation,
  useDeleteCartItemMutation,
  useGetCartByOrderIdQuery,
  useGetCartByProductIdQuery,
  useUpdateCartMutation,
} = StoreApi;
export const { endpoints } = StoreApi;
