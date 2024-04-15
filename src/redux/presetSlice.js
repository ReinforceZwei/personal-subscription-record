import pb, { SPENT_PRESET_COL } from '../services/pocketbase'
import { baseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'

export const presetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPresets: builder.query({
            providesTags: (result) => generateCacheTagList(result, 'presets'),
            queryFn: async () => {
                try {
                    const result = await pb.collection(SPENT_PRESET_COL).getFullList({
                        sort: '+weight,+name',
                    })
                    return { data: result }
                } catch (error) {
                    return { error: error.error }
                }
            }
        }),
        addPreset: builder.mutation({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection(SPENT_PRESET_COL).create({...data, owned_by: pb.authStore.model.id})
                    return { data: result }
                } catch (error) {
                    return { error: error.error }
                }
            }
        }),
        updatePreset: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'presets', id }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection(SPENT_PRESET_COL).update(id, {...data, owned_by: pb.authStore.model.id})
                    return { data: result }
                } catch (error) {
                    return { error: error.error }
                }
            }
        }),
        deletePreset: builder.mutation({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (id) => {
                try {
                    await pb.collection(SPENT_PRESET_COL).delete(id)
                    return { data: null }
                } catch (error) {
                    return { error: error.error }
                }
            }
        })
    })
})

export const {
    useGetPresetsQuery,
    useAddPresetMutation,
    useUpdatePresetMutation,
    useDeletePresetMutation,
} = presetApi