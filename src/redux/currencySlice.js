import { getCurrencyRate } from '../services/currency'
import { pocketbaseApi } from './api'

export const currencyApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCurrencyRate: builder.query({
            queryFn: async () => {
                try {
                    return { data: await getCurrencyRate() }
                } catch (error) {
                    return { error }
                }
            }
        })
    })
})

export const {
    useGetCurrencyRateQuery
} = currencyApi