import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { Box, Button, IconButton, Popover, Stack } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

const calendarMinDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 })

const YearPickerProps = {
    value: 0,
    onChange: (value) => {},
}

export default function YearPicker(props = YearPickerProps) {
    const { value, onChange } = props
    const [calendarValue, setCalendarValue] = useState(DateTime.fromObject({ year: value }))

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const onCalendarChange = (date) => {
        setCalendarValue(date)
        onChange(date.get('year'))
        handleClose()
    }

    const onBackClick = () => {
        const newValue = calendarValue.minus({ year: 1 })
        if (newValue > calendarMinDate) {
            setCalendarValue(newValue)
            onChange(newValue.get('year'))
        }
    }

    const onNextClick = () => {
        const newValue = calendarValue.plus({ year: 1 })
        if (newValue < DateTime.now()) {
            setCalendarValue(newValue)
            onChange(newValue.get('year'))
        }
    }

    useEffect(() => {
        setCalendarValue(DateTime.fromObject({ year: value }))
    }, [value])

    return (
        <Box>
            <Stack direction='row' spacing={2}>
                <IconButton onClick={onBackClick}><ArrowBackIosNewIcon /></IconButton>
                <Button size="large" endIcon={<ArrowDropDownIcon />} onClick={handleClick}>{calendarValue.get('year')}</Button>
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
                <YearCalendar value={calendarValue} onChange={onCalendarChange} disableFuture minDate={calendarMinDate} />
            </Popover>
        </Box>
    )
}