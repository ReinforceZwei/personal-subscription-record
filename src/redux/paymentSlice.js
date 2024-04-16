import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { supabase, PAYMENT_METHOD_COL } from '../services/supabase'

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query({
            providesTags: (result) => generateCacheTagList(result, 'payments'),
            queryFn: async () => {
                const { data, error } = await supabase.from(PAYMENT_METHOD_COL).select().order('weight').order('name')
                if (error) {
                    return { error }
                }
                return { data }
            }
        }),
        addPayment: builder.mutation({
            invalidatesTags: [{ type: 'payments', id: '*' }],
            queryFn: async (data) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(PAYMENT_METHOD_COL).insert({...data, owned_by: userId})
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        updatePayment: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'payments', id }],
            queryFn: async ({ id, data }) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(PAYMENT_METHOD_COL).update({...data, owned_by: userId}).eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        deletePayment: builder.mutation({
            invalidatesTags: [{ type: 'payments', id: '*' }],
            queryFn: async (id) => {
                const { error } = await supabase.from(PAYMENT_METHOD_COL).delete().eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
    })
})

export const {
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentApi


export const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payments: [],
    },
})

export default paymentSlice.reducer

export const selectPayments = (state) => state.payment.payments