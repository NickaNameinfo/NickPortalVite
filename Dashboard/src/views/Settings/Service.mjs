import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();

export const SettingsApi = createApi({
  reducerPath: "SettingsApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["StoreMenuPermissions", "SubUsers", "SubUserPermissions"],
  endpoints: (builder) => ({
    // ========== Store Menu Permissions (Admin Only) ==========
    // Get menu permissions for a specific store
    getStoreMenuPermissions: builder.query({
      query: (storeId) => ({
        url: `/store/menu-permissions/${storeId}`,
        method: "GET",
      }),
      providesTags: (result, error, storeId) => [
        { type: "StoreMenuPermissions", id: storeId },
      ],
    }),

    // Update a single menu permission for a store
    updateStoreMenuPermission: builder.mutation({
      query: ({ storeId, menuKey, enabled }) => ({
        url: `/store/menu-permissions/${storeId}`,
        method: "POST",
        body: {
          menuKey,
          enabled,
        },
      }),
      invalidatesTags: (result, error, { storeId }) => [
        { type: "StoreMenuPermissions", id: storeId },
      ],
    }),

    // Bulk update menu permissions for a store
    bulkUpdateStoreMenuPermissions: builder.mutation({
      query: ({ storeId, permissions }) => ({
        url: `/store/menu-permissions/${storeId}/bulk`,
        method: "POST",
        body: {
          permissions,
        },
      }),
      invalidatesTags: (result, error, { storeId }) => [
        { type: "StoreMenuPermissions", id: storeId },
      ],
    }),

    // ========== Sub-User Management (Vendor/Store) ==========
    // Get all sub-users for current vendor/store
    getSubUsers: builder.query({
      query: () => ({
        url: `/auth/sub-users/list`,
        method: "GET",
      }),
      providesTags: ["SubUsers"],
    }),

    // Create a new sub-user
    createSubUser: builder.mutation({
      query: (body) => ({
        url: `/auth/sub-users/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubUsers"],
    }),

    // Update sub-user
    updateSubUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/auth/sub-users/update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubUsers"],
    }),

    // Delete sub-user
    deleteSubUser: builder.mutation({
      query: (id) => ({
        url: `/auth/sub-users/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["SubUsers"],
    }),

    // Get sub-user by ID
    getSubUserById: builder.query({
      query: (id) => ({
        url: `/auth/sub-users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "SubUsers", id },
      ],
    }),

    // ========== Sub-User Menu Permissions ==========
    // Get menu permissions for a sub-user
    getSubUserMenuPermissions: builder.query({
      query: (subUserId) => ({
        url: `/auth/sub-users/${subUserId}/menu-permissions`,
        method: "GET",
      }),
      providesTags: (result, error, subUserId) => [
        { type: "SubUserPermissions", id: subUserId },
      ],
    }),

    // Update menu permissions for a sub-user
    updateSubUserMenuPermission: builder.mutation({
      query: ({ subUserId, menuKey, enabled }) => ({
        url: `/auth/sub-users/${subUserId}/menu-permissions`,
        method: "POST",
        body: {
          menuKey,
          enabled,
        },
      }),
      invalidatesTags: (result, error, { subUserId }) => [
        { type: "SubUserPermissions", id: subUserId },
      ],
    }),

    // Bulk update menu permissions for a sub-user
    bulkUpdateSubUserMenuPermissions: builder.mutation({
      query: ({ subUserId, permissions }) => ({
        url: `/auth/sub-users/${subUserId}/menu-permissions/bulk`,
        method: "POST",
        body: {
          permissions,
        },
      }),
      invalidatesTags: (result, error, { subUserId }) => [
        { type: "SubUserPermissions", id: subUserId },
      ],
    }),

    // ========== Admin Verification ==========
    // Get pending sub-users for admin approval
    getPendingSubUsers: builder.query({
      query: () => ({
        url: `/auth/sub-users/pending`,
        method: "GET",
      }),
      providesTags: ["SubUsers"],
    }),

    // Get all approved sub-users (Admin only) - with optional filters
    getAllApprovedSubUsers: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.storeId) params.append('storeId', filters.storeId);
        if (filters.vendorId) params.append('vendorId', filters.vendorId);
        if (filters.status) params.append('status', filters.status);
        const queryString = params.toString();
        return {
          url: `/auth/sub-users/approved${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["SubUsers"],
    }),

    // Get sub-users summary by store and vendor (Admin only) - with optional filters
    getSubUsersSummary: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.storeId) params.append('storeId', filters.storeId);
        if (filters.vendorId) params.append('vendorId', filters.vendorId);
        const queryString = params.toString();
        return {
          url: `/auth/sub-users/summary${queryString ? `?${queryString}` : ''}`,
          method: "GET",
        };
      },
      providesTags: ["SubUsers"],
    }),

    // Approve sub-user (Admin only)
    approveSubUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/auth/sub-users/approve/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubUsers"],
    }),

    // Reject sub-user (Admin only)
    rejectSubUser: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/auth/sub-users/reject/${id}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["SubUsers"],
    }),
  }),
});

export const {
  useGetStoreMenuPermissionsQuery,
  useUpdateStoreMenuPermissionMutation,
  useBulkUpdateStoreMenuPermissionsMutation,
  useGetSubUsersQuery,
  useCreateSubUserMutation,
  useUpdateSubUserMutation,
  useDeleteSubUserMutation,
  useGetSubUserByIdQuery,
  useGetSubUserMenuPermissionsQuery,
  useUpdateSubUserMenuPermissionMutation,
  useBulkUpdateSubUserMenuPermissionsMutation,
  useGetPendingSubUsersQuery,
  useGetAllApprovedSubUsersQuery,
  useGetSubUsersSummaryQuery,
  useApproveSubUserMutation,
  useRejectSubUserMutation,
} = SettingsApi;

export const { endpoints } = SettingsApi;

