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

export const BillingApi = createApi({
  reducerPath: "Billing",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    addBill: builder.mutation({
      query: (body) => ({
        url: `/billing/add`,
        method: "POST",
        body,
      }),
    }),
    updateBill: builder.mutation({
      query: (body) => ({
        url: `/billing/update`,
        method: "POST",
        body,
      }),
    }),
    getBills: builder.query({
      query: () => ({
        url: `/billing/getAll`,
        method: "GET",
      }),
    }),
    getBillById: builder.query({
      query: (id) => ({
        url: `/billing/getById/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddBillMutation,
  useUpdateBillMutation,
  useGetBillsQuery,
  useGetBillByIdQuery,
} = BillingApi;
export const { endpoints } = BillingApi;

