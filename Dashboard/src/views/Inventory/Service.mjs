import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();

/**
 * Inventory API Service
 * Handles inbound and outbound inventory transactions with vendor details
 */
export const InventoryApi = createApi({
  reducerPath: "Inventory",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    /**
     * Get inventory summary for the authenticated user's store/vendor
     * Requires: Authentication token
     * URL: GET /inventory/summary
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getInventorySummary: builder.query({
      query: () => ({
        url: `/inventory/summary`,
        method: "GET",
      }),
    }),

    /**
     * Get inbound transactions for the authenticated user's store/vendor
     * Requires: Authentication token
     * URL: GET /inventory/inbound
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getInboundTransactions: builder.query({
      query: ({ startDate, endDate, productId, clientId }) => {
        let url = `/inventory/inbound`;
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (productId) params.append("productId", productId);
        if (clientId) params.append("clientId", clientId);
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        return {
          url,
          method: "GET",
        };
      },
    }),

    /**
     * Get outbound transactions for the authenticated user's store/vendor
     * Requires: Authentication token
     * URL: GET /inventory/outbound
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getOutboundTransactions: builder.query({
      query: ({ startDate, endDate, productId, orderId }) => {
        let url = `/inventory/outbound`;
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (productId) params.append("productId", productId);
        if (orderId) params.append("orderId", orderId);
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        return {
          url,
          method: "GET",
        };
      },
    }),

    /**
     * Get vendor inventory statistics for the authenticated user's store/vendor
     * Requires: Authentication token
     * URL: GET /inventory/vendor-stats
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getVendorInventoryStats: builder.query({
      query: () => ({
        url: `/inventory/vendor-stats`,
        method: "GET",
      }),
    }),

    /**
     * Add inbound inventory transaction
     * Requires: Authentication token
     * URL: POST /inventory/inbound
     */
    addInboundTransaction: builder.mutation({
      query: (body) => ({
        url: `/inventory/inbound`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Add outbound inventory transaction
     * Requires: Authentication token
     * URL: POST /inventory/outbound
     */
    addOutboundTransaction: builder.mutation({
      query: (body) => ({
        url: `/inventory/outbound`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Update inbound transaction
     * Requires: Authentication token
     * URL: POST /inventory/inbound/update
     */
    updateInboundTransaction: builder.mutation({
      query: (body) => ({
        url: `/inventory/inbound/update`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Update outbound transaction
     * Requires: Authentication token
     * URL: POST /inventory/outbound/update
     */
    updateOutboundTransaction: builder.mutation({
      query: (body) => ({
        url: `/inventory/outbound/update`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Delete inbound transaction
     * Requires: Authentication token
     * URL: DELETE /inventory/inbound/:id
     */
    deleteInboundTransaction: builder.mutation({
      query: (id) => ({
        url: `/inventory/inbound/${id}`,
        method: "DELETE",
      }),
    }),

    /**
     * Delete outbound transaction
     * Requires: Authentication token
     * URL: DELETE /inventory/outbound/:id
     */
    deleteOutboundTransaction: builder.mutation({
      query: (id) => ({
        url: `/inventory/outbound/${id}`,
        method: "DELETE",
      }),
    }),

    /**
     * Get all clients for the authenticated user's store/vendor
     * Requires: Authentication token
     * URL: GET /inventory/clients
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getClients: builder.query({
      query: ({ search, page, limit } = {}) => {
        let url = `/inventory/clients`;
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        return {
          url,
          method: "GET",
        };
      },
    }),

    /**
     * Get client by ID
     * Requires: Authentication token
     * URL: GET /inventory/clients/:id
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getClientById: builder.query({
      query: (id) => ({
        url: `/inventory/clients/${id}`,
        method: "GET",
      }),
    }),

    /**
     * Create a new client
     * Requires: Authentication token
     * URL: POST /inventory/clients
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    createClient: builder.mutation({
      query: (body) => ({
        url: `/inventory/clients`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Update an existing client
     * Requires: Authentication token
     * URL: PUT /inventory/clients/:id
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    updateClient: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/clients/${id}`,
        method: "PUT",
        body,
      }),
    }),

    /**
     * Update client (alternative POST endpoint)
     * Requires: Authentication token
     * URL: POST /inventory/clients/update
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    updateClientPost: builder.mutation({
      query: (body) => ({
        url: `/inventory/clients/update`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Delete a client
     * Requires: Authentication token
     * URL: DELETE /inventory/clients/:id
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/inventory/clients/${id}`,
        method: "DELETE",
      }),
    }),

    /**
     * Get all inventory products for the authenticated user's store/vendor
     * Requires: Authentication token
     * URL: GET /inventory/products
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getInventoryProducts: builder.query({
      query: ({ search, page, limit, categoryId, status } = {}) => {
        let url = `/inventory/products`;
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (categoryId) params.append("categoryId", categoryId);
        if (status) params.append("status", status);
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
        return {
          url,
          method: "GET",
        };
      },
    }),

    /**
     * Get inventory product by ID
     * Requires: Authentication token
     * URL: GET /inventory/products/:id
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    getInventoryProductById: builder.query({
      query: (id) => ({
        url: `/inventory/products/${id}`,
        method: "GET",
      }),
    }),

    /**
     * Create a new inventory product
     * Requires: Authentication token
     * URL: POST /inventory/products
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    createInventoryProduct: builder.mutation({
      query: (body) => ({
        url: `/inventory/products`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Update an existing inventory product
     * Requires: Authentication token
     * URL: PUT /inventory/products/:id
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    updateInventoryProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inventory/products/${id}`,
        method: "PUT",
        body,
      }),
    }),

    /**
     * Update inventory product (alternative POST endpoint)
     * Requires: Authentication token
     * URL: POST /inventory/products/update
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    updateInventoryProductPost: builder.mutation({
      query: (body) => ({
        url: `/inventory/products/update`,
        method: "POST",
        body,
      }),
    }),

    /**
     * Delete an inventory product
     * Requires: Authentication token
     * URL: DELETE /inventory/products/:id
     * Note: vendorId is automatically extracted from authenticated user's session
     */
    deleteInventoryProduct: builder.mutation({
      query: (id) => ({
        url: `/inventory/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetInventorySummaryQuery,
  useGetInboundTransactionsQuery,
  useGetOutboundTransactionsQuery,
  useGetVendorInventoryStatsQuery,
  useAddInboundTransactionMutation,
  useAddOutboundTransactionMutation,
  useUpdateInboundTransactionMutation,
  useUpdateOutboundTransactionMutation,
  useDeleteInboundTransactionMutation,
  useDeleteOutboundTransactionMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useUpdateClientPostMutation,
  useDeleteClientMutation,
  useGetInventoryProductsQuery,
  useGetInventoryProductByIdQuery,
  useCreateInventoryProductMutation,
  useUpdateInventoryProductMutation,
  useUpdateInventoryProductPostMutation,
  useDeleteInventoryProductMutation,
} = InventoryApi;

export const { endpoints } = InventoryApi;

