import pb, { SPENT_PRESET_COL, SpentPreset } from '../services/pocketbase'
import { pocketbaseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { handlePbError } from '../vendors/pocketbaseUtils'

export const presetApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPresets: builder.query<SpentPreset[], void>({
            // @ts-expect-error
            providesTags: (result) => generateCacheTagList(result, 'presets'),
            queryFn: async () => {
                try {
                    const result = await pb.collection<SpentPreset>(SPENT_PRESET_COL).getFullList({
                        sort: '+weight,+name',
                    })
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        addPreset: builder.mutation<SpentPreset, Partial<SpentPreset>>({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection<SpentPreset>(SPENT_PRESET_COL).create({...data, owned_by: pb.authStore.model?.id})
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        updatePreset: builder.mutation<SpentPreset, any>({
            invalidatesTags: (result, error, { id }) => [{ type: 'presets', id }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection<SpentPreset>(SPENT_PRESET_COL).update(id, {...data, owned_by: pb.authStore.model?.id})
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        deletePreset: builder.mutation<null, string>({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (id) => {
                try {
                    await pb.collection<SpentPreset>(SPENT_PRESET_COL).delete(id)
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