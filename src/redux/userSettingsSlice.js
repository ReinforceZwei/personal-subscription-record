import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseApi } from './api'
import { supabase, USER_SETTINGS_COL } from '../services/supabase'

export const userSettingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserSettings: builder.query({
            providesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async (defaultSettings) => {
                const { data } = await supabase.from(USER_SETTINGS_COL).select().limit(1).maybeSingle()
                if (data) {
                    return { data }
                }
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { data: newData, error } = await supabase.from(USER_SETTINGS_COL).insert({
                    ...defaultSettings,
                    owned_by: userId,
                }).select().limit(1).single()
                if (error) {
                    return { error }
                }
                return { data: newData }
            }
        }),
        updateUserSettings: builder.mutation({
            invalidatesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async ({ id, data }) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(USER_SETTINGS_COL).update({...data, owned_by: userId}).eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
    })
})

export const {
    useGetUserSettingsQuery,
    useUpdateUserSettingsMutation,
} = userSettingsApi



export const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState: {
        userSettings: {},
    },
})

export default userSettingsSlice.reducer

export const selectUserSettings = (state) => state.userSettings.userSettings