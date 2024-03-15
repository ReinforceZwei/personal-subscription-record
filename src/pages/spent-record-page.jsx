import { useEffect, useState, useContext } from 'react'
import { PocketBaseContext } from '../main'
import { DateTime } from 'luxon'
import { AppBar, Box, Card, CardContent, Chip, Divider, InputLabel, List, ListItem, ListItemText, Paper, Stack, Toolbar, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker } from '@mui/x-date-pickers'
import AirIcon from '@mui/icons-material/Air';
import { SPENT_RECORD_COL, SPENT_SUM_BY_MONTH_COL } from '../services/pocketbase'

export default function SpentRecordPage() {
    const pb = useContext(PocketBaseContext)
    //const [records, setRecords] = useState([])
    const [groupedRecords, setGroupedRecords] = useState([])
    const [selectedDate, setSelectedDate] = useState(DateTime.now())
    const [monthSum, setMonthSum] = useState(0)

    useEffect(() => {
        (async () => {
            const startDate = selectedDate.set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
            const endDate = selectedDate.plus({ month: 1 }).set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 })
            let result = await pb.collection(SPENT_RECORD_COL).getFullList({
                sort: '-created',
                expand: 'type,payment',
                filter: `created >= '${startDate}' && created < '${endDate}'`
            })
            console.log(result)
            //setRecords(result)
            let a = result.reduce((prev, curr) => {
                let date = DateTime.fromSQL(curr.created)
                let key = date.toLocaleString()
                if (prev[key]) {
                    prev[key].push(curr)
                } else {
                    prev[key] = [curr]
                }
                return prev
            }, {})
            setGroupedRecords(Object.keys(a).map((date) => {
                return {
                    date,
                    records: a[date],
                }
            }))

            pb.collection(SPENT_SUM_BY_MONTH_COL)
                .getFirstListItem(`year_month = '${selectedDate.toFormat('yyyy-MM')}'`)
                .then(sum => {
                    setMonthSum(sum?.price || 0)
                })
                .catch(() => {
                    setMonthSum(0)
                })
        })()
    }, [selectedDate])

    
    console.log(groupedRecords)

    return (
        <Box sx={{mb: 10, mt: 1}}>
            <Grid container justifyContent='center' spacing={1} columns={{ xs: 8, sm: 12 }} rowSpacing={2}>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>Total</Typography>
                            <Typography>${monthSum}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5'>Allowance</Typography>
                            <Typography>$---</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={8} sm={4}>
                    <DatePicker label='Month' views={['year', 'month']} openTo='month' value={selectedDate} onChange={(value) => setSelectedDate(value)} sx={{width: '100%'}} />
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
                                <ListItem key={record.id}>
                                    <Chip label={record.expand.type.name} sx={{backgroundColor: record.expand.type.color, mr: 1}} />
                                    <ListItemText primary={record.name} secondary={DateTime.fromSQL(record.created).toLocaleString(DateTime.TIME_SIMPLE)} />
                                    <span>${record.price}</span>
                                </ListItem>
                                { (length - 1 !== i)&&<Divider variant='inset'></Divider>}
                                </>
                            ))}
                        </List>
                    </div>
                ))}
            </Box>
            {/* <div>
                {groupedRecords.map(({date, records}) => (
                    <>
                    {date}
                    <ListGroup key={date} variant="flush">
                        {records.map((record) => (
                            <ListGroup.Item key={record.id}>
                                <Stack direction='horizontal' gap={2}>
                                    <div><BsColorBadge className="fs-6" bg={record.expand.type.color}>{record.expand.type.name}</BsColorBadge></div>
                                    <Stack>
                                        <Stack direction='horizontal' gap={2}>
                                            <div> {record.name}</div>
                                            
                                        </Stack>
                                        <small className='text-body-secondary'>{DateTime.fromSQL(record.created).toLocaleString(DateTime.TIME_SIMPLE)}</small>
                                    </Stack>
                                    {record.payment && <BsColorBadge bg={record.expand.payment.color}>{record.expand.payment.name}</BsColorBadge>}
                                    <div className='ms-auto'>${record.price}</div>
                                </Stack>
                                
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    </>
                ))}
                
            </div> */}
        </Box>
    )
}