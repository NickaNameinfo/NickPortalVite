import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";

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

export const VendorStockApi = createApi({
  reducerPath: "vendorStock",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    addStock: builder.mutation({
      query: (body) => ({
        url: `/vendorStock`,
        method: "POST",
        body,
      }),
    }),
    getStock: builder.query({
      query: (id) => ({
        url: `/vendorStock`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAddStockMutation, useGetStockQuery } = VendorStockApi;
export const { endpoints } = VendorStockApi;
