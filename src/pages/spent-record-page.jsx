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
import { selectAllRecord, fetchRecords, fetchMonthSum, setSelectedDate, selectSelectedDate } from '../redux/recordSlice'

export default function SpentRecordPage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const records = useSelector(selectAllRecord)
    const monthSum = useSelector((state) => state.record.monthSum)
    const selectedDate = DateTime.fromISO(useSelector(selectSelectedDate))
    const yearMonth = selectedDate.toFormat('yyyy-MM')
    //const [records, setRecords] = useState([])
    //const [groupedRecords, setGroupedRecords] = useState([])
    //const [selectedDate, setSelectedDate] = useState(DateTime.now())
    //const [monthSum, setMonthSum] = useState(0)

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

    useEffect(() => {
        dispatch(fetchRecords())
        dispatch(fetchMonthSum())
    }, [dispatch, yearMonth])

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

    
    console.log(groupedRecords)

    return (
        <Box sx={{mb: 10, mt: 1}}>
            <Grid container justifyContent='center' spacing={1} columns={{ xs: 8, sm: 12 }} rowSpacing={2}>
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
                            <Typography variant='h5'>${monthSum[yearMonth] || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>Allowance</Typography>
                            <Typography variant='h5'>$---</Typography>
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