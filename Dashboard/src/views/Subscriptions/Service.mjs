import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers, { getState }) => {
    const token = getCookie("token"); // Assuming getCookie is a function to retrieve the token from cookies
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

export const SucriptioniApi = createApi({
  reducerPath: "SucriptioniApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    // Admin DetailPage API
    getSubcription: builder.query({
      query: (body) => ({
        url: `/subscription`,
        method: "GET",
      }),
    }),
    getSubcriptionByCustomerID: builder.query({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "GET",
      }),
    }),
    addSubcription: builder.mutation({
      query: (body) => ({
        url: `/subscription/create`,
        method: "POST",
        body,
      }),
    }),
    updatesubscription: builder.mutation({
      query: (body) => ({
        url: `/subscription/update`,
        method: "POST",
        body,
      }),
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/${id}`,
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
} = SucriptioniApi;
export const { endpoints } = SucriptioniApi;
