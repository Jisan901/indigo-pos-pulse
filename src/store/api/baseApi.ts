// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/quotes" }),
    reducerPath: "baseApi",
    tagTypes: ["User"],
    endpoints: () => ({
    }),
})

export default baseApi;
