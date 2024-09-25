import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export const pocketbaseApi = createApi({
    reducerPath: 'api',
    baseQuery: fakeBaseQuery(),
    endpoints: () => ({}),
    tagTypes: ['budget', 'payments', 'presets', 'records', 'subscriptions', 'types', 'userSettings', 'suggestedName', 'monthSumType', 'monthSum']
})
