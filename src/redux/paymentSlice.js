import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { SPENT_RECORD_NAME_COL, SPENT_TYPE_COL, PAYMENT_METHOD_COL } from '../services/pocketbase'

export const fetchPayments = createAsyncThunk('payment/fetchPayments', async () => {
    const payments = await pb.collection(PAYMENT_METHOD_COL).getFullList({
        sort: '+name',
    })
    return payments
})

export const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payments: [],
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPayments.fulfilled, (state, action) => {
            state.payments = action.payload

        })
    }
})

export default paymentSlice.reducer

export const selectPayments = (state) => state.payment.payments