import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { removePbDefaultField } from '../vendors/pocketbaseUtils'
import { baseApi } from './api'
import { supabase, BUDGET_HISTORY_COL } from '../services/supabase'

export const budgetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBudget: builder.query({
            providesTags: [{ type: 'budget', id: '*' }],
            queryFn: async ({ date, type }) => {
                const _date = DateTime.fromISO(date.toString()).endOf('month').toUTC()
                const { data, error } = await supabase
                    .from(BUDGET_HISTORY_COL)
                    .select()
                    .lte('created_at', _date)
                    .eq('type', type)
                    .limit(1).maybeSingle()
                if (error) {
                    return { error }
                }
                return { data }
                
            }
        }),
        updateBudget: builder.mutation({
            invalidatesTags: [{ type: 'budget', id: '*' }],
            queryFn: async ({ budget, type }) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(BUDGET_HISTORY_COL).insert({
                    budget,
                    type,
                    owned_by: userId
                })
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        })
    })
})

export const {
    useGetBudgetQuery,
    useUpdateBudgetMutation,
} = budgetApi


export const budgetSlice = createSlice({
    name: 'budget',
    initialState: {
        budget: null,
    },
})

export default budgetSlice.reducer

export const selectBudget = (state) => state.budget.budget