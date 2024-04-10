import { useEffect, useState, useContext, useMemo, Fragment } from 'react'
import { DateTime } from 'luxon'
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Card, CardActionArea, CardActions, CardContent, Chip, Divider, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Toolbar, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker } from '@mui/x-date-pickers'
import AirIcon from '@mui/icons-material/Air';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSelector, useDispatch } from 'react-redux'
import RecordTypeChip from '../components/record-type-chip'
import RecordDetailModal from '../components/record-detail-modal'
import { setSelectedDate, selectSelectedDate } from '../redux/recordSlice'
import _ from 'lodash-es'
import { useGetTypesQuery } from '../redux/typeSlice'
import TypeSumDetailModal from '../components/type-sum-detail-modal'
import { useGetBudgetQuery } from '../redux/budgetSlice'
import { useGetRecordsQuery } from '../redux/recordSlice'
import { hideLinearProgress, showLinearProgress } from '../redux/uiSlice'
import { sumBy, subtract } from '../vendors/fixedPointMath'

export default function SpentRecordPage() {
    const dispatch = useDispatch()

    // User selected year-month
    const selectedDate = DateTime.fromISO(useSelector(selectSelectedDate))

    const { data: types, isLoading: isTypeLoading } = useGetTypesQuery()
    const { data: budget, isLoading: isBudgetLoading } = useGetBudgetQuery(selectedDate.toISO())
    const { data: records, error, isLoading: isRecordLoading } = useGetRecordsQuery(selectedDate.toISO())

    useEffect(() => {
        if (isTypeLoading || isBudgetLoading || isRecordLoading) {
            dispatch(showLinearProgress())
        } else {
            dispatch(hideLinearProgress())
        }
    }, [isTypeLoading, isBudgetLoading, isRecordLoading])

    const monthSum = useMemo(() => {
        return sumBy(records, x => x.price)
    }, [records])

    // Group raw records by date (year-month-day)
    const groupedRecords = useMemo(() => {
        return _.chain(records)
            .groupBy(x => DateTime.fromSQL(x.created).toLocaleString())
            .map((v, k) => ({ date: k, records: v }))
            .value()
    }, [records])

    const recordsByType = useMemo(() => {
        return _.groupBy(records, x => x.type)
    })

    // Get spending sum for each type
    const typeMonthSum = useMemo(() => {
        if (types && records) {
            return _.chain(recordsByType)
                .map((v, k) => {
                    return {
                        id: k,
                        type: _.find(types, x => x.id === k),
                        sum: sumBy(v, x => x.price),
                        records: recordsByType[k]
                    }
                })
                .value()
        }
        return []
    }, [records, types])

    const balance = useMemo(() => {
        return budget?.budget ? subtract(budget.budget, monthSum) : null
    }, [budget, monthSum])

    const [detailModal, setDetailModal] = useState({
        record: null,
        open: false,
    })

    const [typeDetailModal, setTypeDetailModal] = useState({
        type: null,
        typeSum: 0,
        open: false,
        records: [],
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

    const handleTypeSumDetail = (type, sum, records) => {
        console.log(type, sum)
        setTypeDetailModal({
            open: true,
            type: type,
            typeSum: sum,
            records: records,
        })
    }


    return (
        <Box sx={{mt: 1}}>
            <Grid container spacing={1} columns={{ xs: 8, sm: 12 }} rowSpacing={1}>
                <Grid xs={8} sm={4}>
                    <DatePicker
                        label='月份'
                        views={['year', 'month']}
                        openTo='month'
                        value={selectedDate}
                        onChange={(value) => dispatch(setSelectedDate(value.startOf('month').toISO()))}
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
                            <Grid xs={4} key={details.type?.id}>
                                <Card elevation={2}>
                                    <CardActionArea onClick={() => {handleTypeSumDetail(details.type, details.sum, details.records)}}>
                                        <CardContent>
                                            <Typography component='div'><RecordTypeChip label={details.type?.name} bg={details.type?.color} /></Typography>
                                            <Typography variant='h5'>
                                                ${details.sum || '---'}
                                                
                                                {' '}
                                                { details.type?.budget_per_month > 0 && (
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
                    records={typeDetailModal.records}
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
                    <Box key={date}>
                        <Divider><Chip label={date} size='small' /></Divider>
                        <List>
                            {records.map((record, i, { length }) => (
                                <Fragment key={record.id} >
                                <ListItemButton key={record.id} onClick={() => handleRecordClick(record)}>
                                    <RecordTypeChip label={record.expand.type.name} bg={record.expand.type.color} sx={{mr: 1}} />
                                    <ListItemText primary={record.name} secondary={DateTime.fromSQL(record.created).toLocaleString(DateTime.TIME_SIMPLE)} />
                                    <span>${record.price}</span>
                                </ListItemButton>
                                { (length - 1 !== i)&&<Divider variant='inset' key={record.id + '_Divider'}></Divider>}
                                </Fragment>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>

            <RecordDetailModal open={detailModal.open} onClose={handleCloseDetailModal} record={detailModal.record} />
        </Box>
    )
}