import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import pb, { SPENT_RECORD_COL, SPENT_SUM_BY_MONTH_COL, SPENT_SUM_BY_MONTH_TYPE_COL, SpentRecord, SpentSumByMonth, SpentSumByTypeMonth } from '../services/pocketbase'
import { pocketbaseApi } from './api'
import { generateCacheTagList } from '../vendors/rtkQueryUtils'
import { handlePbError } from '../vendors/pocketbaseUtils'
import { RootState } from '../store'

const recordApi = pocketbaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecords: builder.query<SpentRecord[], string>({
            // @ts-expect-error
            providesTags: (result) => generateCacheTagList(result, 'records'),
            queryFn: async (selectedDate) => {
                const _selectedDate = DateTime.fromISO(selectedDate.toString())
                const startDate = _selectedDate.startOf('month').toUTC().toString()
                const endDate = _selectedDate.endOf('month').toUTC().toString()
                try {
                    const data = await pb.collection<SpentRecord>(SPENT_RECORD_COL).getFullList({
                        sort: '-created',
                        expand: 'type,payment',
                        fields: '*,expand.type.name,expand.type.color,expand.payment.name',
                        filter: `created >= '${startDate}' && created <= '${endDate}'`
                    })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        addRecord: builder.mutation<SpentRecord, Partial<SpentRecord>>({
            invalidatesTags: [
                { type: 'records', id: '*' },
                { type: 'suggestedName', id: '*' },
                { type: 'monthSumType', id: new Date().getFullYear() },
            ],
            queryFn: async (data) => {
                try {
                    const result = await pb.collection<SpentRecord>(SPENT_RECORD_COL).create(data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        updateRecord: builder.mutation<SpentRecord, any>({
            invalidatesTags: [
                { type: 'records', id: '*' },
                { type: 'suggestedName', id: '*' },
                { type: 'monthSumType', id: new Date().getFullYear() },
            ],
            queryFn: async ({ id, data }) => {
                try {
                    const result = await pb.collection<SpentRecord>(SPENT_RECORD_COL).update(id, data)
                    return { data: result }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        getMonthSum: builder.query<SpentSumByMonth, string>({
            providesTags: ['monthSum'],
            queryFn: async (date) => {
                const _date = DateTime.fromISO(date.toString())
                try {
                    const data = await pb.collection<SpentSumByMonth>(SPENT_SUM_BY_MONTH_COL)
                        .getFirstListItem(`year_month = '${_date.toFormat('yyyy-MM')}'`)
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        getMonthTypeSumByYear: builder.query<SpentSumByTypeMonth[], any>({
            providesTags: (result, error, arg) => ([{ type: 'monthSumType', id: arg }]),
            queryFn: async (year) => {
                try {
                    const data = await pb.collection<SpentSumByTypeMonth>(SPENT_SUM_BY_MONTH_TYPE_COL)
                        .getFullList({
                            filter: `year = ${year}`,
                        })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
        getMonthTypeSumByYearMonth: builder.query<SpentSumByTypeMonth[], any>({
            providesTags: (result, error, arg) => ([{ type: 'monthSumType', id: `${arg.year}${arg.month}` }]),
            queryFn: async ({ year, month }) => {
                try {
                    const data = await pb.collection<SpentSumByTypeMonth>(SPENT_SUM_BY_MONTH_TYPE_COL)
                        .getFullList({
                            filter: `year = ${year} && month = ${month}`,
                        })
                    return { data }
                } catch (error) {
                    return handlePbError(error)
                }
            }
        }),
    })
})

export const {
    useGetRecordsQuery,
    useGetMonthSumQuery,
    useAddRecordMutation,
    useUpdateRecordMutation,
    useGetMonthTypeSumByYearQuery,
    useGetMonthTypeSumByYearMonthQuery,
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

export default recordSlice.reducer

export const { setSelectedDate } = recordSlice.actions

export const selectSelectedDate = (state: RootState) => state.record.selectedDate