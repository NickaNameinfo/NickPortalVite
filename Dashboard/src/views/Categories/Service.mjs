import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers, { getState }) => {
    const token = getCookie("token"); // Assuming getCookie is a function to retrieve the token from cookies
    console.log(token, "token4352345");
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

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
        body,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery, useAddCategoriesMutation } =
  CategoriesApi;
export const { endpoints } = CategoriesApi;
