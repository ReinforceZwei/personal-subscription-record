import { useEffect, useState, useContext, useMemo, Fragment } from 'react'
import { DateTime } from 'luxon'
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Card, CardActionArea, CardActions, CardContent, Chip, Divider, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Toolbar, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker } from '@mui/x-date-pickers'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSelector, useDispatch } from 'react-redux'
import RecordTypeChip from '../components/RecordType/record-type-chip'
import { setSelectedDate, selectSelectedDate } from '../redux/recordSlice'
import _ from 'lodash-es'
import { useGetTypesQuery } from '../redux/typeSlice'
import TypeSumDetailModal from '../components/type-sum-detail-modal'
import { useGetBudgetListQuery, useGetBudgetQuery } from '../redux/budgetSlice'
import { useGetRecordsQuery } from '../redux/recordSlice'
import { hideLinearProgress, showLinearProgress } from '../redux/uiSlice'
import { sumBy, subtract } from '../vendors/fixedPointMath'
import SpentRecordList from '../components/SpendRecord/spent-record-list'
import { useAppDispatch } from '../hooks'
import { PaymentMethod, SpentRecord, SpentType } from '../services/pocketbase'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGetPaymentsQuery } from '../redux/paymentSlice'
import PaymentSumDetailModal from '../components/payment-sum-detail-modal'

export default function SpentRecordPage() {
    const dispatch = useAppDispatch()

    // User selected year-month
    const selectedDate = DateTime.fromISO(useSelector(selectSelectedDate))

    const { data: types, isLoading: isTypeLoading } = useGetTypesQuery()
    const { data: payments, isLoading: isPaymentLoading } = useGetPaymentsQuery()
    const { data: budget, isLoading: isBudgetLoading } = useGetBudgetQuery({date: selectedDate.toISO(), type: 'spent'})
    const { data: records, error, isLoading: isRecordLoading } = useGetRecordsQuery(selectedDate.toISO()!)

    useEffect(() => {
        if (isTypeLoading || isBudgetLoading || isRecordLoading || isPaymentLoading) {
            dispatch(showLinearProgress())
        } else {
            dispatch(hideLinearProgress())
        }
    }, [isTypeLoading, isBudgetLoading, isRecordLoading, isPaymentLoading])

    const monthSum = useMemo(() => {
        return sumBy(records || [], x => x.price)
    }, [records])

    const recordsByType = useMemo(() => {
        return _.groupBy(records, x => x.type)
    }, [records])

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

    const recordsByPayment = useMemo(() => {
        return _.groupBy(records, x => x.payment)
    }, [records])

    const paymentMonthSum = useMemo(() => {
        if (payments && records) {
            return _.chain(recordsByPayment)
                .map((v, k) => {
                    return {
                        id: k,
                        payment: _.find(payments, x => x.id === k),
                        sum: sumBy(v, x => x.price),
                        records: recordsByPayment[k]
                    }
                })
                .value()
        }
        return []
    })

    const balance = useMemo(() => {
        return budget?.budget ? subtract(budget.budget, monthSum) : null
    }, [budget, monthSum])

    const [typeDetailModal, setTypeDetailModal] = useState<{
        type: SpentType | null,
        typeSum: number,
        open: boolean,
        records: SpentRecord[]
    }>({
        type: null,
        typeSum: 0,
        open: false,
        records: [],
    })

    const handleTypeSumDetail = (type: SpentType, sum: number, records: SpentRecord[]) => {
        console.log(type, sum)
        setTypeDetailModal({
            open: true,
            type: type,
            typeSum: sum,
            records: records,
        })
    }

    const [paymentDetailModal, setPaymentDetailModal] = useState<{
        payment: PaymentMethod | null,
        paymentSum: number,
        open: boolean,
        records: SpentRecord[]
    }>({
        payment: null,
        paymentSum: 0,
        open: false,
        records: [],
    })

    const handlePaymentSumDetail = (payment: PaymentMethod, sum: number, records: SpentRecord[]) => {
        console.log(payment, sum)
        setPaymentDetailModal({
            open: true,
            payment: payment,
            paymentSum: sum,
            records: records,
        })
    }

    const onBackClick = () => {
        const newValue = selectedDate.minus({ month: 1 })
        dispatch(setSelectedDate(newValue.toISO()))
    }

    const onNextClick = () => {
        const newValue = selectedDate.plus({ month: 1 })
        if (newValue < DateTime.now()) {
            dispatch(setSelectedDate(newValue.toISO()))
        }
    }


    return (
        <Box sx={{mt: 1}}>
            <Grid container spacing={1} columns={{ xs: 8, sm: 12 }} rowSpacing={1}>
                <Grid xs={8} sm={4}>
                    <Box display='flex' alignItems='center' justifyContent='center'>
                        <IconButton onClick={onBackClick}><ArrowBackIosNewIcon /></IconButton>
                        <DatePicker
                            label='月份'
                            views={['year', 'month']}
                            openTo='month'
                            value={selectedDate}
                            onChange={(value) => dispatch(setSelectedDate(value!.startOf('month').toISO()))}
                            sx={{width: '100%'}}
                            disableFuture
                            closeOnSelect
                        />
                        <IconButton onClick={onNextClick}><ArrowForwardIosIcon /></IconButton>
                    </Box>
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
                                    color: (balance || 0) < 0 ? 'error.main' : 'success.main',
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
                                    <CardActionArea onClick={() => {handleTypeSumDetail(details.type!, details.sum, details.records)}}>
                                        <CardContent>
                                            <Typography component='div'><RecordTypeChip label={details.type?.name} bg={details.type?.color} /></Typography>
                                            <Typography variant='h5'>
                                                ${details.sum || '---'}
                                                
                                                {' '}
                                                { (details.type) && (details.type?.budget_per_month > 0) && (
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

            <Accordion disableGutters sx={{ mt: 1}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>支付方式</AccordionSummary>

                <AccordionDetails>
                    <Grid container spacing={1} columns={{ xs: 8, sm: 12 }}>
                        {paymentMonthSum.map((details) => (
                            <Grid xs={4} key={details.payment?.id}>
                                <Card elevation={2}>
                                    <CardActionArea onClick={() => {handlePaymentSumDetail(details.payment!, details.sum, details.records)}}>
                                        <CardContent>
                                            <Typography component='div'>{details.payment?.name}</Typography>
                                            <Typography variant='h5'>
                                                ${details.sum || '---'}
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
                    type={typeDetailModal.type!}
                    typeSum={typeDetailModal.typeSum}
                    records={typeDetailModal.records}
                />
            )}

            {paymentDetailModal.open && (
                <PaymentSumDetailModal
                    open={paymentDetailModal.open}
                    onClose={() => setPaymentDetailModal({...paymentDetailModal, open: false})}
                    payment={paymentDetailModal.payment!}
                    paymentSum={paymentDetailModal.paymentSum}
                    records={paymentDetailModal.records}
                />
            )}

            <SpentRecordList records={records!} />
        </Box>
    )
}