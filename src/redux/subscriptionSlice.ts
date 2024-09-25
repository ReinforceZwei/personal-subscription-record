import pb, { SUBSCRIPTION_PLAN_COL } from '../services/pocketbase'
import { pocketbaseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { handlePbError } from '../vendors/pocketbaseUtils'

export const subscriptionApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            // @ts-expect-error
            providesTags: (result) => generateCacheTagList(result, 'subscriptions'),
            queryFn: async () => {
                try {
                    const result = await pb.collection(SUBSCRIPTION_PLAN_COL).getFullList({
                        sort: 'created',
                    })
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        addSubscription: builder.mutation({
            invalidatesTags: [{ type: 'subscriptions', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection(SUBSCRIPTION_PLAN_COL).create({...data, owned_by: pb.authStore.model?.id})
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        updateSubscription: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'subscriptions', id }],
            queryFn: async ({ data, id }) => {
                try {
                    const result = await pb.collection(SUBSCRIPTION_PLAN_COL).update(id, {...data, owned_by: pb.authStore.model?.id})
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        deleteSubscription: builder.mutation({
            invalidatesTags: [{ type: 'subscriptions', id: '*' }],
            queryFn: async (id) => {
                try {
                    const result = await pb.collection(SUBSCRIPTION_PLAN_COL).delete(id)
                    return { data: null }
                } catch (error) {
                    return handlePbError(error)
                }
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