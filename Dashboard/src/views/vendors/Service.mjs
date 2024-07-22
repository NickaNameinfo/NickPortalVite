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
        method: "POST",
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
