import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { SPENT_RECORD_NAME_COL, SPENT_TYPE_COL } from '../services/pocketbase'
import { sort } from 'fast-sort'

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

export const updateType = createAsyncThunk('type/updateType', async (args) => {
    const { id, data } = args

    const result = await pb.collection(SPENT_TYPE_COL).update(id, data)
    return result
})

export const addType = createAsyncThunk('type/addType', async (args) => {
    const { data } = args

    const result = await pb.collection(SPENT_TYPE_COL).create(data)
    return result
})

export const deleteType = createAsyncThunk('type/deleteType', async (args) => {
    const { id } = args

    return await pb.collection(SPENT_TYPE_COL).delete(id)
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

        }).addCase(updateType.fulfilled, (state, action) => {
            const idx = state.types.findIndex((type) => type.id === action.payload.id)
            const copy = [...state.types]
            copy[idx] = action.payload
            state.types = sort(copy).by([
                { asc: x => x.name },
            ])

        }).addCase(addType.fulfilled, (state, action) => {
            const copy = [...state.types]
            copy.push(action.payload)
            state.types = sort(copy).by([
                { asc: x => x.name },
            ])

        }).addCase(deleteType.fulfilled, (state, action) => {
            const idx = state.types.findIndex((type) => type.id === action.meta.arg.id)
            state.types.splice(idx, 1)

        })
    }
})

export default typeSlice.reducer

export const selectTypes = (state) => state.type.types
export const selectSuggestedNames = (state) => state.type.suggestedNames