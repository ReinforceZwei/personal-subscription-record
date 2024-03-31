import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export const pocketbaseApi = createApi({
    reducerPath: 'api',
    baseQuery: fakeBaseQuery(),
    endpoints: () => ({}),
})