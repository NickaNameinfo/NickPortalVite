import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();

export const InvoiceFormatsApi = createApi({
  reducerPath: "InvoiceFormatsApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["InvoiceFormats", "StoreInvoiceFormats", "VendorInvoiceFormats"],
  endpoints: (builder) => ({
    // Get all invoice formats
    getAllInvoiceFormats: builder.query({
      query: () => ({
        url: `/invoice-formats/list`,
        method: "GET",
      }),
      providesTags: ["InvoiceFormats"],
    }),

    // Get invoice format by ID
    getInvoiceFormatById: builder.query({
      query: (id) => ({
        url: `/invoice-formats/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "InvoiceFormats", id }],
    }),

    // Create new invoice format
    createInvoiceFormat: builder.mutation({
      query: (body) => ({
        url: `/invoice-formats/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["InvoiceFormats"],
    }),

    // Update invoice format
    updateInvoiceFormat: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/invoice-formats/update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "InvoiceFormats", id }],
    }),

    // Delete invoice format
    deleteInvoiceFormat: builder.mutation({
      query: (id) => ({
        url: `/invoice-formats/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["InvoiceFormats"],
    }),

    // Get invoice format assigned to store
    getStoreInvoiceFormat: builder.query({
      query: (storeId) => ({
        url: `/invoice-formats/store/${storeId}`,
        method: "GET",
      }),
      providesTags: (result, error, storeId) => [{ type: "StoreInvoiceFormats", id: storeId }],
    }),

    // Assign invoice format to store
    assignStoreInvoiceFormat: builder.mutation({
      query: ({ storeId, formatId }) => ({
        url: `/invoice-formats/store/${storeId}/assign`,
        method: "POST",
        body: { formatId },
      }),
      invalidatesTags: (result, error, { storeId }) => [{ type: "StoreInvoiceFormats", id: storeId }],
    }),

    // Get invoice format assigned to vendor
    getVendorInvoiceFormat: builder.query({
      query: (vendorId) => ({
        url: `/invoice-formats/vendor/${vendorId}`,
        method: "GET",
      }),
      providesTags: (result, error, vendorId) => [{ type: "VendorInvoiceFormats", id: vendorId }],
    }),

    // Assign invoice format to vendor
    assignVendorInvoiceFormat: builder.mutation({
      query: ({ vendorId, formatId }) => ({
        url: `/invoice-formats/vendor/${vendorId}/assign`,
        method: "POST",
        body: { formatId },
      }),
      invalidatesTags: (result, error, { vendorId }) => [{ type: "VendorInvoiceFormats", id: vendorId }],
    }),

    // Get all invoice format assignments (Admin only)
    getAllInvoiceFormatAssignments: builder.query({
      query: () => ({
        url: `/invoice-formats/assignments`,
        method: "GET",
      }),
      providesTags: ["StoreInvoiceFormats", "VendorInvoiceFormats"],
    }),
  }),
});

export const {
  useGetAllInvoiceFormatsQuery,
  useGetInvoiceFormatByIdQuery,
  useCreateInvoiceFormatMutation,
  useUpdateInvoiceFormatMutation,
  useDeleteInvoiceFormatMutation,
  useGetStoreInvoiceFormatQuery,
  useAssignStoreInvoiceFormatMutation,
  useGetVendorInvoiceFormatQuery,
  useAssignVendorInvoiceFormatMutation,
  useGetAllInvoiceFormatAssignmentsQuery,
} = InvoiceFormatsApi;

export const { endpoints } = InvoiceFormatsApi;

