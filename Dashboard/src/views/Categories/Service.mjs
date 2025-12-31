import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();
export const CategoriesApi = createApi({
  reducerPath: "Categories",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    addCategories: builder.mutation({
      query: (body) => ({
        url: `/category/create`,
        method: "POST",
        body,
      }),
    }),
    getCategories: builder.query({
      query: (body) => ({
        url: `/category/getAllCategory`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery, useAddCategoriesMutation } =
  CategoriesApi;
export const { endpoints } = CategoriesApi;
