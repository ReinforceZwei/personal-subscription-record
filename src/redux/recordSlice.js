import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { baseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { supabase, SPENT_RECORD_COL } from '../services/supabase'

const recordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecords: builder.query({
            providesTags: (result) => generateCacheTagList(result, 'records'),
            queryFn: async (selectedDate) => {
                const _selectedDate = DateTime.fromISO(selectedDate.toString())
                const startDate = _selectedDate.startOf('month').toUTC().toString()
                const endDate = _selectedDate.endOf('month').toUTC().toString()
                const { data, error } = await supabase.from(SPENT_RECORD_COL)
                    .select('*, type ( id, name, color ), payment ( id, name )')
                    .gte('created_at', startDate)
                    .lte('created_at', endDate)
                    .order('created_at', { ascending: false })
                if (error) {
                    return { error }
                }
                return { data }
            }
        }),
        addRecord: builder.mutation({
            invalidatesTags: [{ type: 'records', id: '*' }, { type: 'suggestedName', id: '*' }],
            queryFn: async (data) => {
                const { data: { session } } = await supabase.auth.getSession()
                const userId = session.user.id
                const { error } = await supabase.from(SPENT_RECORD_COL).insert({...data, owned_by: userId})
                if (error) {
                    return { error }
                }
                return { data: null }
            }
        }),
        // getMonthSum: builder.query({
        //     providesTags: ['monthSum'],
        //     queryFn: async (date) => {
        //         const _date = DateTime.fromISO(date.toString())
        //         try {
        //             const data = await pb.collection(SPENT_SUM_BY_MONTH_COL)
        //                 .getFirstListItem(`year_month = '${_date.toFormat('yyyy-MM')}'`)
        //             return { data }
        //         } catch (error) {
        //             return { error: error.error }
        //         }
        //     }
        // })
    })
})

export const {
    useGetRecordsQuery,
    useAddRecordMutation,
} = recordApi


export const recordSlice = createSlice({
    name: 'record',
    initialState: {
        records: [],
        groupedRecords: [],
        monthSum: {},
        selectedDate: DateTime.now().startOf('month').toISO(),
    },
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload
        },
    },
})

export const { setSelectedDate } = recordSlice.actions

export default recordSlice.reducer

export const selectAllRecord = (state) => state.record.records
export const selectGroupedRecord = (state) => state.record.groupedRecords
export const selectSelectedDate = (state) => state.record.selectedDate