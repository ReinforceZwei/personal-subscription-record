import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { SPENT_RECORD_NAME_COL, SPENT_TYPE_COL } from '../services/pocketbase'

export const fetchTypes = createAsyncThunk('type/fetchTypes', async () => {
    const types = await pb.collection(SPENT_TYPE_COL).getFullList({
        sort: '+name'
    })
    return types
})

export const fetchSuggestedName = createAsyncThunk('type/fetchSuggestedName', async (args) => {
    const { selectedType } = args
    if (!selectedType) {
        return []
    }
    const names = await pb.collection(SPENT_RECORD_NAME_COL).getFullList({
        sort: '+name',
        filter: `type = '${selectedType.id}'`
    })
    return names
})

export const typeSlice = createSlice({
    name: 'type',
    initialState: {
        types: [],
        suggestedNames: [],
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTypes.fulfilled, (state, action) => {
            state.types = action.payload

        }).addCase(fetchSuggestedName.fulfilled, (state, action) => {
            state.suggestedNames = action.payload

        })
    }
})

export default typeSlice.reducer

export const selectTypes = (state) => state.type.types
export const selectSuggestedNames = (state) => state.type.suggestedNames