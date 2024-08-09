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
  }),
});

export const { useGetStoresProductByIDQuery, useGetStoresQuery } = StoreApi;
export const { endpoints } = StoreApi;
