import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
import { prepareHeaders } from "../../../utils/authHelper.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers, { getState }) => {
    return prepareHeaders(headers, { getState });
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
    getProductImg: builder.query({
      query: (body) => ({
        url: `/product/getAllPhoto`,
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
    getProductsByCategory: builder.query({
      query: (id) => ({
        url: `/product/getAllByCategory?categoryIds=${id}`,
        method: "GET",
      }),
    }),
    getProductsBySearch: builder.query({
      query: (query) => ({
        url: `/product/gcatalogsearch/result?search=${query}`,
        method: "GET",
      }),
    }),
    getProductsByPaymenType: builder.query({
      query: (query) => ({
        url: `/product/gcatalogsearch/result?paymentModes=${query}`,
        method: "GET",
      }),
    }),
    getProductsByOpenShop: builder.query({
      query: (query) => ({
        url: `/product/getProductsByOpenStores`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useGetProductImgQuery,
  useGetProductsByCategoryQuery,
  useGetProductsBySearchQuery,
  useGetProductsByPaymenTypeQuery,
  useGetProductsByOpenShopQuery
} = ProductApi;
export const { endpoints } = ProductApi;
