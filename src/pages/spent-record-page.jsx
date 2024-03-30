import { useEffect, useState, useContext, useMemo } from 'react'
import { PocketBaseContext } from '../main'
import { DateTime } from 'luxon'
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Card, CardActionArea, CardActions, CardContent, Chip, Divider, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Toolbar, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker } from '@mui/x-date-pickers'
import AirIcon from '@mui/icons-material/Air';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSelector, useDispatch } from 'react-redux'
import { SPENT_RECORD_COL, SPENT_SUM_BY_MONTH_COL } from '../services/pocketbase'
import RecordTypeChip from '../components/record-type-chip'
import RecordDetailModal from '../components/record-detail-modal'
import { selectAllRecord, fetchRecords, fetchMonthSum, setSelectedDate, selectSelectedDate, selectGroupedRecord } from '../redux/recordSlice'
import _ from 'lodash-es'
import { fetchUserSettings, selectUserSettings } from '../redux/userSettingsSlice'
import { fetchTypes, selectTypes } from '../redux/typeSlice'
import RecordTypeCard from '../components/record-type-card'
import TypeSumDetailModal from '../components/type-sum-detail-modal'
import { createBudget, fetchBudget, selectBudget } from '../redux/budgetSlice'

export default function SpentRecordPage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const now = DateTime.now()

    const records = useSelector(selectAllRecord)
    const selectedDate = DateTime.fromISO(useSelector(selectSelectedDate))
    const yearMonth = selectedDate.toFormat('yyyy-MM')
    const userSettings = useSelector(selectUserSettings)
    const types = useSelector(selectTypes)
    const historyBudget = useSelector(selectBudget)
    const budget = (selectedDate.hasSame(now, 'year') && selectedDate.hasSame(now, 'month'))
        ? userSettings?.budget_per_month
        : historyBudget?.budget

    const monthSum = useMemo(() => {
        return _.round(_.sumBy(records, x => x.price), 2)
    }, [records])

    const groupedRecords = useMemo(() => {
        return _.chain(records)
            .groupBy(x => DateTime.fromSQL(x.created).toLocaleString())
            .map((v, k) => ({date: k, records: v}))
            .value()
    }, [records])

    const typeMonthSum = useMemo(() => {
        if (types.length && records.length) {
            return _.chain(records)
                .groupBy(x => x.type)
                .map((v, k) => {
                    return {id: k, type: _.find(types, x => x.id === k), sum: _.sumBy(v, x => x.price)}
                })
                .value()
        }
        return []
    }, [records, types])

    const balance = useMemo(() => {
        return _.round(_.subtract(budget, monthSum), 2)
    }, [budget, monthSum])

    useEffect(() => {
        dispatch(fetchRecords())
        if (!(selectedDate.hasSame(now, 'year') && selectedDate.hasSame(now, 'month'))) {
            dispatch(fetchBudget({ year: selectedDate.year, month: selectedDate.month }))
        }

    }, [dispatch, yearMonth])

    useEffect(() => {
        dispatch(fetchUserSettings())
        dispatch(fetchTypes())
    }, [])

    useEffect(() => {
        if (userSettings.budget_per_month) {
            // Ensure budget record is created in backend
            dispatch(createBudget({ budget: userSettings.budget_per_month }))
        }
    }, [userSettings])

    const [detailModal, setDetailModal] = useState({
        record: null,
        open: false,
    })

    const [typeDetailModal, setTypeDetailModal] = useState({
        type: null,
        typeSum: 0,
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

    const handleTypeSumDetail = (type, sum) => {
        console.log(type, sum)
        setTypeDetailModal({
            open: true,
            type: type,
            typeSum: sum,
        })
    }


    return (
        <Box sx={{mb: 10, mt: 1}}>
            <Grid container spacing={1} columns={{ xs: 8, sm: 12 }} rowSpacing={1}>
                <Grid xs={8} sm={4}>
                    <DatePicker
                        label='月份'
                        views={['year', 'month']}
                        openTo='month'
                        value={selectedDate}
                        onChange={(value) => dispatch(setSelectedDate(value.toISO()))}
                        sx={{width: '100%'}}
                        disableFuture
                        closeOnSelect
                    />
                </Grid>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>支出</Typography>
                            <Typography variant='h5'>${monthSum || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography>餘額</Typography>
                            <Typography variant='h5'
                                sx={{
                                    color: balance < 0 ? 'error.main' : 'success.main',
                                }}
                            >${balance || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
            </Grid>

            <Accordion disableGutters sx={{ mt: 1}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>詳細分類</AccordionSummary>

                <AccordionDetails>
                    <Grid container spacing={1} columns={{ xs: 8, sm: 12 }}>
                        {typeMonthSum.map((details) => (
                            <Grid xs={4}>
                                <Card elevation={2}>
                                    <CardActionArea onClick={() => {handleTypeSumDetail(details.type, details.sum)}}>
                                        <CardContent>
                                            <Typography component='div'><RecordTypeChip label={details.type.name} bg={details.type.color} /></Typography>
                                            <Typography variant='h5'>
                                                ${details.sum || '---'}
                                                
                                                {' '}
                                                { details.type.budget_per_month > 0 && (
                                                    <Typography
                                                        sx={{
                                                            color: (details.type.budget_per_month - details.sum) < 0 ? 'error.main' : 'success.main',
                                                        }}
                                                        display='inline'
                                                    >(${details.type.budget_per_month - details.sum || '---'})</Typography>
                                                ) }
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {typeDetailModal.open && (
                <TypeSumDetailModal
                    open={typeDetailModal.open}
                    onClose={() => setTypeDetailModal({...typeDetailModal, open: false})}
                    type={typeDetailModal.type}
                    typeSum={typeDetailModal.typeSum}
                />
            )}

            <Box mt={1}>
                {!groupedRecords.length && (
                    <Stack direction='row' justifyContent='center'>
                        <AirIcon />
                        <Typography sx={{
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>沒有記錄 </Typography>
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