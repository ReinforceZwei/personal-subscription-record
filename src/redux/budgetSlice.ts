import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { BUDGET_HISTORY_COL, BudgetHistory } from '../services/pocketbase'
import { DateTime } from 'luxon'
import { handlePbError, removePbDefaultField } from '../vendors/pocketbaseUtils'
import { pocketbaseApi } from './api'

export const budgetApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBudget: builder.query<BudgetHistory, any>({
            providesTags: [{ type: 'budget', id: '*' }],
            queryFn: async ({ date, type }) => {
                const _date = DateTime.fromISO(date.toString()).endOf('month').toUTC()
                const filter = `created <= '${_date}' && type = '${type}'`
                try {
                    const data = await pb.collection<BudgetHistory>(BUDGET_HISTORY_COL).getFirstListItem(filter, { sort: '-created' })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        getBudgetList: builder.query<BudgetHistory[], any>({
            queryFn: async ({ date, list }) => {
                const _date = DateTime.fromISO(date.toString()).endOf('month').toUTC()
                const result = []
                for (let type of list) {
                    try {
                        const filter = `created <= '${_date}' && type = '${type.id}'`
                        const data = await pb.collection<BudgetHistory>(BUDGET_HISTORY_COL).getFirstListItem(filter, { sort: '-created' })
                        result.push(data)
                    } catch {}
                }
                return { data: result }
            }
        }),
        updateBudget: builder.mutation<BudgetHistory, any>({
            invalidatesTags: [{ type: 'budget', id: '*' }],
            queryFn: async ({ budget, type }) => {
                try {
                    const data = await pb.collection<BudgetHistory>(BUDGET_HISTORY_COL).create({
                        budget,
                        type,
                        owned_by: pb.authStore.model?.id,
                    })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
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
