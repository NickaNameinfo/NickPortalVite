import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../configData";

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
    // Admin DetailPage API
    getVendors: builder.query({
      query: (body) => ({
        url: `/vendors`,
        method: "GET",
      }),
    }),
    addVendors: builder.mutation({
      query: (body) => ({
        url: `/vendors`,
        method: "POST",
        body,
      }),
    }), 
  }),
});

export const { useGetVendorsQuery, useAddVendorsMutation } = VendorApi;
export const { endpoints } = VendorApi;
