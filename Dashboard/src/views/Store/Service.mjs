import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();
export const StoreApi = createApi({
  reducerPath: "StoreApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getStore: builder.query({
      query: (body) => ({
        url: `/store/admin/list`,
        method: "GET",
      }),
    }),
    getStoreArea: builder.query({
      query: (body) => ({
        url: `/location/area/list`,
        method: "GET",
      }),
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/store/delete/${id}`,
        method: "POST",
      }),
    }),
    addStore: builder.mutation({
      query: (body) => ({
        url: `/store/create`,
        method: "POST",
        body,
      }),
    }),
    getStoresByID: builder.query({
      query: (id) => ({
        url: `/store/list/${id}`,
        method: "GET",
      }),
    }),
    getStoresProductByID: builder.query({
      query: (id) => ({
        url: `/store/product/admin/getAllProductById/${id}`,
        method: "GET",
      }),
    }),
    updateStore: builder.mutation({
      query: (body) => ({
        url: `/store/update`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetStoreQuery,
  useGetStoreAreaQuery,
  useDeleteStoreMutation,
  useAddStoreMutation,
  useGetStoresByIDQuery,
  useUpdateStoreMutation,
  useGetStoresProductByIDQuery
} = StoreApi;
export const { endpoints } = StoreApi;
