import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const CategoryApi = createApi({
  reducerPath: "CategoryApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: (body) => ({
        url: `/category/getAllCategory`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoryQuery } = CategoryApi;
export const { endpoints } = CategoryApi;
