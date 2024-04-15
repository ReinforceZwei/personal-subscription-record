import { baseApi } from './api'
import { supabase } from '../services/supabase'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSession: builder.query({
            providesTags: [{ type: 'user', id: 'session' }],
            queryFn: async () => {
                const { data, error } = await supabase.auth.getSession()
                if (error) {
                    return { error }
                }
                return { data: data.session }
            }
        }),
    })
})

export const {
    useGetSessionQuery,
} = userApi