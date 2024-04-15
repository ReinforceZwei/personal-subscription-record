import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { USER_SETTINGS_COL } from '../services/pocketbase'
import { baseApi } from './api'

export const userSettingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserSettings: builder.query({
            providesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async (defaultSettings) => {
                try {
                    const result = (await pb.collection(USER_SETTINGS_COL).getList(1, 1))
                    if (result.totalItems < 1) {
                        if (defaultSettings) {
                            const result = await pb.collection(USER_SETTINGS_COL).create({
                                ...defaultSettings,
                                owned_by: pb.authStore.model.id
                            })
                            return { data: result }
                        }
                        return { data: null }
                    }
                    return { data: result.items[0] }
                } catch (error) {
                    return { error: error.error }
                }
            }
        }),
        createUserSettings: builder.mutation({
            invalidatesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection(USER_SETTINGS_COL).create(data)
                    return { data: result }
                } catch (error) {
                    return { error: error.error }
                }
            }
        }),
        updateUserSettings: builder.mutation({
            invalidatesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection(USER_SETTINGS_COL).update(id, data)
                    return { data: result }
                } catch (error) {
                    return { error: error.error }
                }
            }
        }),
    })
})

export const {
    useGetUserSettingsQuery,
    useCreateUserSettingsMutation,
    useUpdateUserSettingsMutation,
} = userSettingsApi


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