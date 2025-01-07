import { CurrencyRate, getCurrencyRate } from '../services/currency'
import { pocketbaseApi } from './api'

export const currencyApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCurrencyRate: builder.query<CurrencyRate, void>({
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