import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { BUDGET_HISTORY_COL } from '../services/pocketbase'
import { DateTime } from 'luxon'
import { removePbDefaultField } from '../vendors/pocketbaseUtils'

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