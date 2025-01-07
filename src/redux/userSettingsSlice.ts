import pb, { USER_SETTINGS_COL, UserSetting } from '../services/pocketbase'
import { pocketbaseApi } from './api'
import { handlePbError } from '../vendors/pocketbaseUtils'
import userSettingsTemplate from '../constant/userSettingsTemplate'

export const userSettingsApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserSettings: builder.query<UserSetting, void>({
            providesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async () => {
                try {
                    const result = (await pb.collection<UserSetting>(USER_SETTINGS_COL).getList(1, 1))
                    if (result.totalItems < 1) {
                        const defaultSettings = userSettingsTemplate
                        const result = await pb.collection<UserSetting>(USER_SETTINGS_COL).create({
                            ...defaultSettings,
                            owned_by: pb.authStore.model?.id
                        })
                        return { data: result }
                    }
                    return { data: result.items[0] }
                } catch (error) {
                    return handlePbError(error)
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
                    return handlePbError(error)
                }
            }
        }),
        updateUserSettings: builder.mutation<UserSetting, any>({
            invalidatesTags: [{ type: 'userSettings', id: '*' }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection<UserSetting>(USER_SETTINGS_COL).update(id, data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
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

