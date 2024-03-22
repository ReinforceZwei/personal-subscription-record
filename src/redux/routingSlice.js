import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const routingSlice = createSlice({
    name: 'routing',
    initialState: {
        lastConfigPage: '',
    },
    reducers: {
        setLastConfigPage: (state, action) => {
            state.lastConfigPage = action.payload
        },
    },
})

export default routingSlice.reducer

export const { setLastConfigPage } = routingSlice.actions

export const selectLastConfigPage = (state) => state.routing.lastConfigPage