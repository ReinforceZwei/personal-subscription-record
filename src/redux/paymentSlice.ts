import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { PAYMENT_METHOD_COL } from '../services/pocketbase'
import { sort } from 'fast-sort'
import { pocketbaseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { handlePbError } from '../vendors/pocketbaseUtils'

export const paymentApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query({
            // @ts-expect-error
            providesTags: (result) => generateCacheTagList(result, 'payments'),
            queryFn: async () => {
                try {
                    const data = await pb.collection(PAYMENT_METHOD_COL).getFullList({
                        sort: '+weight,+name'
                    })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        addPayment: builder.mutation({
            invalidatesTags: [{ type: 'payments', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection(PAYMENT_METHOD_COL).create(data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        updatePayment: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'payments', id }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection(PAYMENT_METHOD_COL).update(id, data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        deletePayment: builder.mutation({
            invalidatesTags: [{ type: 'payments', id: '*' }],
            queryFn: async (id) => {
                try {
                    await pb.collection(PAYMENT_METHOD_COL).delete(id)
                    return { data: null }
                } catch (error) {
                    return handlePbError(error)
                }
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
