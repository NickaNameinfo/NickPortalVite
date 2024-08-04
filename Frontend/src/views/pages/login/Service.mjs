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
    register: builder.mutation({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const { useRegisterMutation } = AuthApi;
export const { endpoints } = AuthApi;
