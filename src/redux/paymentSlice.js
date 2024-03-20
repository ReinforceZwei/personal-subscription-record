import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { SPENT_RECORD_NAME_COL, SPENT_TYPE_COL, PAYMENT_METHOD_COL } from '../services/pocketbase'
import { sort } from 'fast-sort'

export const fetchPayments = createAsyncThunk('payment/fetchPayments', async () => {
    const payments = await pb.collection(PAYMENT_METHOD_COL).getFullList({
        sort: '+name',
    })
    return payments
})

export const addPayment = createAsyncThunk('payment/addPayment', async (args) => {
    const { data } = args

    const result = await pb.collection(PAYMENT_METHOD_COL).create(data)
    return result
})

export const updatePayment = createAsyncThunk('payment/updatePayment', async (args) => {
    const { id, data } = args

    const result = await pb.collection(PAYMENT_METHOD_COL).update(id, data)
    return result
})

export const deletePayment = createAsyncThunk('payment/deletePayment', async (args) => {
    const { id } = args

    return await pb.collection(PAYMENT_METHOD_COL).delete(id)
})

export const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payments: [],
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPayments.fulfilled, (state, action) => {
            state.payments = action.payload

        }).addCase(addPayment.fulfilled, (state, action) => {
            const copy = [...state.payments]
            copy.push(action.payload)
            state.payments = sort(copy).by([
                { asc: x => x.name }
            ])

        }).addCase(updatePayment.fulfilled, (state, action) => {
            const copy = [...state.payments]
            const idx = state.payments.findIndex((payment) => payment.id === action.payload.id)
            copy[idx] = action.payload
            state.payments = sort(copy).by([
                { asc: x => x.name }
            ])

        }).addCase(deletePayment.fulfilled, (state, action) => {
            const idx = state.payments.findIndex((payment) => payment.id === action.meta.arg.id)
            state.payments.splice(idx, 1)

        })
    }
})

export default paymentSlice.reducer

export const selectPayments = (state) => state.payment.payments