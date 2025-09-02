import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { infoData } from "../../../configData";
const axiosBaseQuery = fetchBaseQuery({
  baseUrl: infoData.baseApi, // Set your base URL
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (body) => ({
        url: `/auth/rootLogin`,
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body
      }),
    }),
    updatUser: builder.mutation({
      query: (body) => ({
        url: `/auth/user/update`,
        method: "POST",
        body
      }),
    }),
    uploadFile: builder.mutation({
      query: (body) => ({
        url: `/auth/upload-file`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useUpdatUserMutation, useUploadFileMutation } = AuthApi;
export const { endpoints } = AuthApi;
