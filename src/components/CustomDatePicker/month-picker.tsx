import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { Box, Button, IconButton, Popover, Stack } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DateTime } from 'luxon';
import { MouseEventHandler, useEffect, useState } from 'react';

const calendarMinDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 })

interface MonthPickerProps {
    year: number
    month: number
    onChange: (value: DateTime) => void,
}

export default function MonthPicker(props: MonthPickerProps) {
    const { year, month, onChange } = props
    const [calendarValue, setCalendarValue] = useState(DateTime.fromObject({ year, month }))

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleClick: MouseEventHandler = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const onCalendarChange = (date: DateTime) => {
        setCalendarValue(date)
        onChange(date)
        handleClose()
    }

    const onBackClick = () => {
        const newValue = calendarValue.minus({ month: 1 })
        if (newValue > calendarMinDate) {
            setCalendarValue(newValue)
            onChange(newValue)
        }
    }

    const onNextClick = () => {
        const newValue = calendarValue.plus({ month: 1 })
        if (newValue < DateTime.now()) {
            setCalendarValue(newValue)
            onChange(newValue)
        }
    }

    useEffect(() => {
        setCalendarValue(DateTime.fromObject({ year, month }))
    }, [year, month])

    return (
        <Box>
            <Stack direction='row' spacing={2}>
                <IconButton onClick={onBackClick}><ArrowBackIosNewIcon /></IconButton>
                <Button size="large" endIcon={<ArrowDropDownIcon />} onClick={handleClick}>{calendarValue.get('month')}</Button>
                <IconButton onClick={onNextClick}><ArrowForwardIosIcon /></IconButton>
            </Stack>
            
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <MonthCalendar value={calendarValue} onChange={onCalendarChange} disableFuture minDate={calendarMinDate} />
            </Popover>
        </Box>
    )
}