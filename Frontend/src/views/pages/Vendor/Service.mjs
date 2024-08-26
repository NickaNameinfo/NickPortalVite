import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const VendorApi = createApi({
  reducerPath: "VendorApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: (body) => ({
        url: `/vendor/list`,
        method: "GET",
      }),
    }),
    getVendorsById: builder.query({
      query: (id) => ({
        url: `/vendor/list/${id}`,
        method: "GET",
      }),
    }),
    addVendors: builder.mutation({
      query: (body) => ({
        url: `/vendor/create`,
        method: "POST",
        body,
      }),
    }),
    updateVendors: builder.mutation({
      query: (body) => ({
        url: `/vendor/update`,
        method: "POST",
        body,
      }),
    }),
    deleteVendors: builder.mutation({
      query: (id) => ({
        url: `/vendor/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorsByIdQuery,
  useAddVendorsMutation,
  useUpdateVendorsMutation,
  useDeleteVendorsMutation,
} = VendorApi;
export const { endpoints } = VendorApi;
