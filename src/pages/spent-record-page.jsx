import { useEffect, useState, useContext, useMemo } from 'react'
import { PocketBaseContext } from '../main'
import { DateTime } from 'luxon'
import { AppBar, Box, Card, CardContent, Chip, Divider, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Toolbar, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker } from '@mui/x-date-pickers'
import AirIcon from '@mui/icons-material/Air';
import { useSelector, useDispatch } from 'react-redux'
import { SPENT_RECORD_COL, SPENT_SUM_BY_MONTH_COL } from '../services/pocketbase'
import RecordTypeChip from '../components/record-type-chip'
import RecordDetailModal from '../components/record-detail-modal'
import { selectAllRecord, fetchRecords, fetchMonthSum, setSelectedDate, selectSelectedDate, selectGroupedRecord } from '../redux/recordSlice'
import _ from 'lodash-es'
import { fetchUserSettings, selectUserSettings } from '../redux/userSettingsSlice'

export default function SpentRecordPage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const records = useSelector(selectAllRecord)
    const selectedDate = DateTime.fromISO(useSelector(selectSelectedDate))
    const yearMonth = selectedDate.toFormat('yyyy-MM')
    const userSettings = useSelector(selectUserSettings)

    const monthSum = useMemo(() => {
        return _.round(_.sumBy(records, x => x.price), 2)
    }, [records])

    const groupedRecords = useMemo(() => {
        return _.chain(records)
            .groupBy(x => DateTime.fromSQL(x.created).toLocaleString())
            .map((v, k) => ({date: k, records: v}))
            .value()
    }, [records])

    const balance = useMemo(() => {
        return _.round(_.subtract(userSettings?.budget_per_month, monthSum), 2)
    }, [userSettings, monthSum])

    useEffect(() => {
        dispatch(fetchRecords())

    }, [dispatch, yearMonth])

    useEffect(() => {
        dispatch(fetchUserSettings())
    }, [])

    const [detailModal, setDetailModal] = useState({
        record: null,
        open: false,
    })

    const handleRecordClick = (record) => {
        setDetailModal({
            open: true,
            record: record,
        })
    }

    const handleCloseDetailModal = () => {
        setDetailModal({
            ...detailModal,
            open: false
        })
    }


    return (
        <Box sx={{mb: 10, mt: 1}}>
            <Grid container spacing={1} columns={{ xs: 8, sm: 12 }} rowSpacing={1}>
                <Grid xs={8} sm={4}>
                    <DatePicker
                        label='Month'
                        views={['year', 'month']}
                        openTo='month'
                        value={selectedDate}
                        onChange={(value) => dispatch(setSelectedDate(value.toISO()))}
                        sx={{width: '100%'}}
                    />
                </Grid>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>Total</Typography>
                            <Typography variant='h5'>${monthSum || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>Balance</Typography>
                            <Typography variant='h5'
                                sx={{
                                    color: balance < 0 ? 'error.main' : 'success.main',
                                }}
                            >${balance || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
            </Grid>
            <Box mt={1}>
                {!groupedRecords.length && (
                    <Stack direction='row' justifyContent='center'>
                        <AirIcon />
                        <Typography sx={{
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>No records </Typography>
                    </Stack>
                    
                )}
                {groupedRecords.map(({ date, records }) => (
                    <div key={date}>
                        <Divider><Chip label={date} size='small' /></Divider>
                        <List key={date}>
                            {records.map((record, i, { length }) => (
                                <>
                                <ListItemButton key={record.id} onClick={() => handleRecordClick(record)}>
                                    <RecordTypeChip label={record.expand.type.name} bg={record.expand.type.color} sx={{mr: 1}} />
                                    <ListItemText primary={record.name} secondary={DateTime.fromSQL(record.created).toLocaleString(DateTime.TIME_SIMPLE)} />
                                    <span>${record.price}</span>
                                </ListItemButton>
                                { (length - 1 !== i)&&<Divider variant='inset'></Divider>}
                                </>
                            ))}
                        </List>
                    </div>
                ))}
            </Box>

            <RecordDetailModal open={detailModal.open} onClose={handleCloseDetailModal} record={detailModal.record} />
        </Box>
    )
}