import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();

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
    updateProduct: builder.mutation({
      query: (body) => ({
        url: `/product/update`,
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
    getProductsById: builder.query({
      query: (id) => ({
        url: `/product/getProductById/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useAddStoreProductMutation,
  useAddVendorProductMutation,
  useGetProductsByIdQuery,
  useUpdateProductMutation
} = ProductsApi;
export const { endpoints } = ProductsApi;
