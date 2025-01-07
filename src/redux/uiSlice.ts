import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        linearProgress: false,
    },
    reducers: {
        showLinearProgress: (state) => {
            state.linearProgress = true
        },
        hideLinearProgress: (state) => {
            state.linearProgress = false
        },
    },
})

export default uiSlice.reducer

export const { showLinearProgress, hideLinearProgress } = uiSlice.actions

export const selectLinearProgress = (state: RootState) => state.ui.linearProgress