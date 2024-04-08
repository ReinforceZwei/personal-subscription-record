import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        linearProgress: false,
    },
    reducers: {
        showLinearProgress: (state, action) => {
            state.linearProgress = true
        },
        hideLinearProgress: (state, action) => {
            state.linearProgress = false
        },
    },
})

export default uiSlice.reducer

export const { showLinearProgress, hideLinearProgress } = uiSlice.actions

export const selectLinearProgress = (state) => state.ui.linearProgress