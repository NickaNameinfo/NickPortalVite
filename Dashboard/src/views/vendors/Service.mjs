import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();
export const VendorApi = createApi({
  reducerPath: "VendorApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    // Admin DetailPage API
    getVendors: builder.query({
      query: (body) => ({
        url: `/vendor/list`,
        method: "GET",
      }),
    }),
    getVendorsByID: builder.query({
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
  useGetVendorsByIDQuery,
  useAddVendorsMutation,
  useUpdateVendorsMutation,
  useDeleteVendorsMutation,
} = VendorApi;
export const { endpoints } = VendorApi;
