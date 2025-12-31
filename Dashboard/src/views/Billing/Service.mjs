import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();
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
      query: (id) => ({
        url: `/billing/getByStoreId/${id}`,
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

