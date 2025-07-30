import baseApi from "../api/baseApi";

export const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (query) => ({
        url: `/user`,
        params: query, // Append query parameters to the URL
      }),
      providesTags: ["User"],
    }),
    register: builder.mutation({
      query: (user_credentials) => ({
        url: `/user/create`,
        method: "POST",
        body: user_credentials,
      }),
      invalidatesTags: [{ type: "User" }],
    }),
    updateUser: builder.mutation({
      query: (user_credentials) => ({
        url: `/user/${user_credentials._id}`,
        method: "PATCH",
        body: user_credentials,
      }),
      invalidatesTags: [{ type: "User" }],
    }),
    // delete user using DELETE method
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

} = userApiSlice;