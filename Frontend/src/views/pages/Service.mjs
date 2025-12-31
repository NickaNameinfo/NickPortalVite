import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../configData";
import { prepareHeaders } from "../../utils/authHelper.mjs";

const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers, { getState }) => {
    return prepareHeaders(headers, { getState });
  },
});

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
    })
  }),
});
export const { useRegisterMutation, useLoginMutation } = AuthApi;
export const { endpoints } = AuthApi;
