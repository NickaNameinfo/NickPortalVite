import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/baseQuery.mjs";

const axiosBaseQuery = createBaseQuery();

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    // Admin DetailPage API
    Login: builder.mutation({
      query: (body) => ({
        url: `/auth/rootLogin`,
        method: "POST",
        body,
      }),
    }),
    Register: builder.mutation({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = AuthApi;
export const { endpoints } = AuthApi;
