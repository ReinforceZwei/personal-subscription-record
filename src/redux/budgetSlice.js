import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { BUDGET_HISTORY_COL } from '../services/pocketbase'
import { DateTime } from 'luxon'
import { removePbDefaultField } from '../vendors/pocketbaseUtils'
import { baseApi } from './api'
import { supabase } from '../services/supabase'

export const budgetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBudget: builder.query({
            providesTags: [{ type: 'budget', id: '*' }],
            queryFn: async ({ date, type }) => {
                const _date = DateTime.fromISO(date.toString()).endOf('month').toUTC()
                const filter = `created <= '${_date}' && type = '${type}'`
                const { data, error } = await supabase
                    .from(BUDGET_HISTORY_COL)
                    .select()
                    .lte('created_at', _date)
                    .eq('type', type)
                    .limit(1).single()
                if (error) {
                    return { error }
                }
                return { data }
                
            }
        }),
        getBudgetList: builder.query({
            queryFn: async ({ date, list }) => {
                const _date = DateTime.fromISO(date.toString()).endOf('month').toUTC()
                const result = []
                for (let type of list) {
                    try {
                        const filter = `created <= '${_date}' && type = '${type.id}'`
                        const data = await pb.collection(BUDGET_HISTORY_COL).getFirstListItem(filter, { sort: '-created' })
                        result.push(data)
                    } catch {}
                }
                return { data: result }
            }
        }),
        updateBudget: builder.mutation({
            invalidatesTags: [{ type: 'budget', id: '*' }],
            queryFn: async ({ budget, type }) => {
                try {
                    const data = await pb.collection(BUDGET_HISTORY_COL).create({
                        budget,
                        type,
                        owned_by: pb.authStore.model.id,
                    })
                    return { data }
                } catch (error) {
                    return { error: error.error }
                }
            }
        })
    })
})

export const {
    useGetBudgetQuery,
    useGetBudgetListQuery,
    useUpdateBudgetMutation,
} = budgetApi

export const fetchBudget = createAsyncThunk('budget/fetchBudget', async (args) => {
    const { year, month } = args
    return await pb.collection(BUDGET_HISTORY_COL).getFirstListItem(`year = ${year} && month = ${month}`)
})

export const updateOrCreateBudget = createAsyncThunk('budget/updateOrCreateBudget', async (args) => {
    const { budget } = args
    
    const year = DateTime.now().year
    const month = DateTime.now().month
    try {
        const record = await pb.collection(BUDGET_HISTORY_COL).getFirstListItem(`year = ${year} && month = ${month}`)
        return await pb.collection(BUDGET_HISTORY_COL).update(record.id, { ...removePbDefaultField(record), budget })
    } catch {
        return await pb.collection(BUDGET_HISTORY_COL).create({ year, month, budget, owned_by: pb.authStore.model.id })
    }
})

export const createBudget = createAsyncThunk('budget/createBudget', async (args) => {
    const { budget } = args
    const year = DateTime.now().year
    const month = DateTime.now().month
    return await pb.collection(BUDGET_HISTORY_COL).create({ year, month, budget, owned_by: pb.authStore.model.id })
})

export const budgetSlice = createSlice({
    name: 'budget',
    initialState: {
        budget: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBudget.fulfilled, (state, action) => {
            state.budget = action.payload

        }).addCase(updateOrCreateBudget.fulfilled, (state, action) => {
            

        })
    }
})

export default budgetSlice.reducer

export const selectBudget = (state) => state.budget.budget