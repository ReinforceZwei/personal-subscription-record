import pb, { SPENT_PRESET_COL } from '../services/pocketbase'
import { pocketbaseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { handlePbError } from '../vendors/pocketbaseUtils'

export const presetApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPresets: builder.query({
            // @ts-expect-error
            providesTags: (result) => generateCacheTagList(result, 'presets'),
            queryFn: async () => {
                try {
                    const result = await pb.collection(SPENT_PRESET_COL).getFullList({
                        sort: '+weight,+name',
                    })
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        addPreset: builder.mutation({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection(SPENT_PRESET_COL).create({...data, owned_by: pb.authStore.model?.id})
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        updatePreset: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'presets', id }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection(SPENT_PRESET_COL).update(id, {...data, owned_by: pb.authStore.model?.id})
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
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
                    return handlePbError(error)
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