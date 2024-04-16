import { baseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { supabase, SUBSCRIPTION_PLAN_COL } from '../services/supabase'

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            providesTags: (result) => generateCacheTagList(result, 'subscriptions'),
            queryFn: async () => {
                const { data, error } = await supabase.from(SUBSCRIPTION_PLAN_COL).select().order('created_at')
                if (error) {
                    return { error }
                }
                return { data }
            }
        }),
        addSubscription: builder.mutation({
            invalidatesTags: [{ type: 'subscriptions', id: '*' }],
            queryFn: async (data) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(SUBSCRIPTION_PLAN_COL).insert({...data, owned_by: userId})
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        updateSubscription: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'subscriptions', id }],
            queryFn: async ({ data, id }) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(SUBSCRIPTION_PLAN_COL).update({...data, owned_by: userId}).eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        deleteSubscription: builder.mutation({
            invalidatesTags: [{ type: 'subscriptions', id: '*' }],
            queryFn: async (id) => {
                const { error } = await supabase.from(SUBSCRIPTION_PLAN_COL).delete().eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
    })
})

export const {
    useGetSubscriptionsQuery,
    useAddSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
} = subscriptionApi