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

export const ProductsApi = createApi({
  reducerPath: "Products",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (body) => ({
        url: `/product/add`,
        method: "POST",
        body,
      }),
    }),
    addStoreProduct: builder.mutation({
      query: (body) => ({
        url: `/store/product-add`,
        method: "POST",
        body,
      }),
    }),
    addVendorProduct: builder.mutation({
      query: (body) => ({
        url: `/vendor/product-add`,
        method: "POST",
        body,
      }),
    }),
    getProducts: builder.query({
      query: () => ({
        url: `/product/getAllproductList`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAddProductMutation, useGetProductsQuery, useAddStoreProductMutation, useAddVendorProductMutation } = ProductsApi;
export const { endpoints } = ProductsApi;
