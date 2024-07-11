import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DateTime } from 'luxon';
import YearPicker from '../components/CustomDatePicker/year-picker';
import { useState } from 'react';
import YearMonthBarChart from '../components/Charts/year-month-bar-chart';
import MonthPicker from '../components/CustomDatePicker/month-picker';
import MonthPieChart from '../components/Charts/month-pie-chart';


export default function RecordChartPage() {
    const [selectedYear, setSelectedYear] = useState(DateTime.now().get('year'))
    const [selectedMonth, setSelectedMonth] = useState(DateTime.now().get('month'))

    const handleSelectMonth = (date) => {
        setSelectedYear(date.get('year'))
        setSelectedMonth(date.get('month'))
    }

    return (
        <div>
            <Box display='flex' justifyContent='center'>
                <YearPicker value={selectedYear} onChange={setSelectedYear} />
            </Box>

            <Grid container>
                <Grid xs={12}>
                    <YearMonthBarChart year={selectedYear} />
                </Grid>
            </Grid>

            <Box display='flex' justifyContent='center'>
                <MonthPicker year={selectedYear} month={selectedMonth} onChange={handleSelectMonth} />
            </Box>

            <Grid container>
                <Grid xs={12}>
                    <MonthPieChart year={selectedYear} month={selectedMonth} />
                </Grid>
            </Grid>
        </div>
    )
}