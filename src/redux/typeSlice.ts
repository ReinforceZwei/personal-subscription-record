import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import pb, { SPENT_RECORD_NAME_COL, SPENT_TYPE_COL, SpentRecordName, SpentType } from '../services/pocketbase'
import { sort } from 'fast-sort'
import { pocketbaseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { handlePbError } from '../vendors/pocketbaseUtils'

export const typeApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTypes: builder.query<SpentType[], void>({
            // @ts-expect-error
            providesTags: (result) => generateCacheTagList(result, 'types'),
            queryFn: async () => {
                try {
                    const data = await pb.collection<SpentType>(SPENT_TYPE_COL).getFullList({
                        sort: '+weight,+name'
                    })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        addType: builder.mutation<SpentType, Partial<SpentType>>({
            invalidatesTags: [{ type: 'types', id: '*' }],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection<SpentType>(SPENT_TYPE_COL).create(data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        updateType: builder.mutation({
            invalidatesTags: (result, error, { id }) => [{ type: 'types', id }],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection<SpentType>(SPENT_TYPE_COL).update(id, data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        deleteType: builder.mutation({
            invalidatesTags: [{ type: 'types', id: '*' }],
            queryFn: async (id) => {
                try {
                    await pb.collection<SpentType>(SPENT_TYPE_COL).delete(id)
                    return { data: null }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        getSuggestedName: builder.query({
            providesTags: [{ type: 'suggestedName', id: '*' }],
            queryFn: async (id) => {
                try {
                    const data = await pb.collection<SpentRecordName>(SPENT_RECORD_NAME_COL).getFullList({
                        sort: '-count,+name',
                        filter: `type = '${id}'`
                    })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
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

