import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (body) => ({
        url: `/product/getAllproductList`,
        method: "GET",
      }),
    }),
    getProductsById: builder.query({
      query: (id) => ({
        url: `/product/getProductById`,
        method: "GET",
        params: { id },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductsByIdQuery } = ProductApi;
export const { endpoints } = ProductApi;
