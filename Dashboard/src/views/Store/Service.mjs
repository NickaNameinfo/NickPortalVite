import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
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
        url: `/store/product/getAllProductById/${id}`,
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
