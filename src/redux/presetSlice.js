import { baseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { supabase, SPENT_PRESET_COL } from '../services/supabase'

export const presetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPresets: builder.query({
            providesTags: (result) => generateCacheTagList(result, 'presets'),
            queryFn: async () => {
                const { data, error } = await supabase.from(SPENT_PRESET_COL).select().order('weight').order('name')
                if (error) {
                    return { error }
                }
                return { data }
            }
        }),
        addPreset: builder.mutation({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (data) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(SPENT_PRESET_COL).insert({...data, owned_by: userId})
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        updatePreset: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'presets', id }],
            queryFn: async ({ id, data }) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(SPENT_PRESET_COL).update({...data, owned_by: userId}).eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        deletePreset: builder.mutation({
            invalidatesTags: [{ type: 'presets', id: '*' }],
            queryFn: async (id) => {
                const { error } = await supabase.from(SPENT_PRESET_COL).delete().eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
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