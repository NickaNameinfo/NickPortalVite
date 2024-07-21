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
    getStores: builder.query({
      query: (body) => ({
        url: ``,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStoresQuery } = StoreApi;
export const { endpoints } = StoreApi;
