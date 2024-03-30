import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import pb, { SPENT_RECORD_COL, SPENT_SUM_BY_MONTH_COL } from '../services/pocketbase'

export const fetchRecords = createAsyncThunk('record/fetchRecords', async (args, { getState }) => {
    const selectedDate = DateTime.fromISO(getState().record.selectedDate)
    console.log(selectedDate)
    const startDate = selectedDate.startOf('month').toString()
    const endDate = selectedDate.endOf('month').toString()
    const records = await pb.collection(SPENT_RECORD_COL).getFullList({
        sort: '-created',
        expand: 'type,payment',
        filter: `created >= '${startDate}' && created <= '${endDate}'`
    })

    let a = records.reduce((prev, curr) => {
        let date = DateTime.fromSQL(curr.created)
        let key = date.toLocaleString()
        if (prev[key]) {
            prev[key].push(curr)
        } else {
            prev[key] = [curr]
        }
        return prev
    }, {})
    const groupedRecords = Object.keys(a).map((date) => {
        return {
            date,
            records: a[date],
        }
    })


    return { records, groupedRecords }
})

export const fetchMonthSum = createAsyncThunk('record/fetchMonthSum', async (args, { getState }) => {
    const selectedDate = DateTime.fromISO(getState().record.selectedDate)
    const record = await pb.collection(SPENT_SUM_BY_MONTH_COL)
        .getFirstListItem(`year_month = '${selectedDate.toFormat('yyyy-MM')}'`)
    return record
})

export const recordSlice = createSlice({
    name: 'record',
    initialState: {
        records: [],
        groupedRecords: [],
        monthSum: {},
        selectedDate: DateTime.now().toISO(),
    },
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRecords.fulfilled, (state, action) => {
            state.records = action.payload.records
            state.groupedRecords = action.payload.groupedRecords

        }).addCase(fetchMonthSum.fulfilled, (state, action) => {
            state.monthSum[action.payload['year_month']] = action.payload['price']

        })
    }
})

export const { setSelectedDate } = recordSlice.actions

export default recordSlice.reducer

export const selectAllRecord = (state) => state.record.records
export const selectGroupedRecord = (state) => state.record.groupedRecords
export const selectSelectedDate = (state) => state.record.selectedDate