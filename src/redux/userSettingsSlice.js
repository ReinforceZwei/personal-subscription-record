import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { SPENT_RECORD_NAME_COL, SPENT_TYPE_COL, PAYMENT_METHOD_COL, USER_SETTINGS_COL } from '../services/pocketbase'

export const fetchUserSettings = createAsyncThunk('userSettings/fetchUserSettings', async () => {
    const result = (await pb.collection(USER_SETTINGS_COL).getList(1, 1))
    if (result.totalItems < 1) {
        return null
    }
    return result.items[0]
})

export const createUserSettings = createAsyncThunk('userSettings/createUserSettings', async (args) => {
    const { defaultSettings, id } = args

    const result = await pb.collection(USER_SETTINGS_COL).create({ ...defaultSettings, owned_by: id })
    return result
})

export const updateUserSettings = createAsyncThunk('userSettings/updateUserSettings', async (args) => {
    const { id, data } = args

    const result = await pb.collection(USER_SETTINGS_COL).update(id, data)
    return result
})

export const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState: {
        userSettings: {},
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserSettings.fulfilled, (state, action) => {
            state.userSettings = action.payload

        }).addCase(createUserSettings.fulfilled, (state, action) => {
            state.userSettings = action.payload

        }).addCase(updateUserSettings.fulfilled, (state, action) => {
            state.userSettings = action.payload
            
        })
    }
})

export default userSettingsSlice.reducer

export const selectUserSettings = (state) => state.userSettings.userSettings