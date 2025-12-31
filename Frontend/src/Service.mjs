import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "./configData";
import { prepareHeaders } from "./utils/authHelper.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers, { getState }) => {
    return prepareHeaders(headers, { getState });
  },
});

export const GlobalApi = createApi({
  reducerPath: "globalApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => ({
        url: `/auth/user/${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `/auth/user/update`,
        method: "POST",
        body
      }),
    }),
    updateAddress: builder.mutation({
      query: (body) => ({
        url: `/address/update`,
        method: "POST",
        body,
      }),
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetCartByOrderIdQuery,
  useAddOrderMutation,
  useUpdateCartMutation,
  useDeleteCartItemMutation,
  useUpdateAddressMutation,
  useGetAddressesByCustIdQuery,
  useDeleteAddressMutation,
} = GlobalApi;
export const { endpoints } = GlobalApi;
