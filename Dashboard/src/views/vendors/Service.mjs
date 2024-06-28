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
    addVendors: builder.mutation({
      query: (body) => ({
        url: `/vendor/create`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetVendorsQuery, useAddVendorsMutation } = VendorApi;
export const { endpoints } = VendorApi;
