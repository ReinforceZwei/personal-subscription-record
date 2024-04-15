import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { supabase, SPENT_RECORD_NAME_COL, SPENT_TYPE_COL } from '../services/supabase'

export const typeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTypes: builder.query({
            providesTags: (result) => generateCacheTagList(result, 'types'),
            queryFn: async () => {
                const { data, error } = await supabase.from(SPENT_TYPE_COL).select().order('weight').order('name')
                if (error) {
                    return { error }
                }
                return { data }
            }
        }),
        addType: builder.mutation({
            invalidatesTags: [{ type: 'types', id: '*' }],
            queryFn: async (data) => {
                const { error } = await supabase.from(SPENT_TYPE_COL).insert(data)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        updateType: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'types', id }],
            queryFn: async ({ id, data }) => {
                const { error } = await supabase.from(SPENT_TYPE_COL).update(data).eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        deleteType: builder.mutation({
            invalidatesTags: [{ type: 'types', id: '*' }],
            queryFn: async (id) => {
                const { error } = await supabase.from(SPENT_TYPE_COL).delete().eq('id', id)
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        getSuggestedName: builder.query({
            providesTags: [{ type: 'suggestedName', id: '*' }],
            queryFn: async (id) => {
                const { data, error } = await supabase.from(SPENT_RECORD_NAME_COL).select().eq('type', id)
                if (error) {
                    return { error }
                }
                return { data }
            }
        })
    })
})

export const {
    useGetTypesQuery,
    useAddTypeMutation,
    useUpdateTypeMutation,
    useDeleteTypeMutation,
    useGetSuggestedNameQuery,
} = typeApi


export const typeSlice = createSlice({
    name: 'type',
    initialState: {
        types: [],
    },
})

export default typeSlice.reducer
