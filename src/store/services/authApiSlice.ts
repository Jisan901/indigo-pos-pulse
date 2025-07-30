import baseApi from "../api/baseApi";

export const userApiSlice = baseApi.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (user_credentials) => ({
                url: `auth/login`,
                method: 'POST',
                body: user_credentials,
            }),

        }),
        logout: builder.mutation({
            query: () => ({
                url: `/logout`,
                method: "POST"
            })
        })

    })
});

export const {useLoginMutation,useLogoutMutation} = userApiSlice;