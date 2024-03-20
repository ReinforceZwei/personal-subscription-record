import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../main"
import {
    Autocomplete, Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select, TextField, 
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { fetchSuggestedName, fetchTypes, selectSuggestedNames, selectTypes } from "../redux/typeSlice"

import { PAYMENT_METHOD_COL, SPENT_RECORD_NAME_COL } from "../services/pocketbase"
import RecordTypeChip from "../components/record-type-chip"
import { fetchPayments, selectPayments } from "../redux/paymentSlice"

const CreateRecordModalProps = {
    selectedType: null,
    open: false,
    onClose: () => {},
    onCreate: (data) => {},
    onAnimationExited: () => {},
}

export default function CreateRecordModal(props = CreateRecordModalProps) {
    const { selectedType, open, onClose, onCreate, onAnimationExited, ...other } = props

    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const suggestedName = useSelector(selectSuggestedNames)
    const payments = useSelector(selectPayments)

    const { handleSubmit, reset, setValue, setFocus, control } = useForm({
        defaultValues: {
            name: '',
            payment: '',
            price: '',
        }
    })

    useEffect(() => {
        dispatch(fetchSuggestedName({ selectedType }))

    }, [selectedType])

    useEffect(() => {
        dispatch(fetchPayments())

    }, [])

    useEffect(() => {
        setTimeout(() => {
            setFocus('price')
        }, 1)
    }, [])

    return (
        <Dialog open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth='sm'
            sx={{
                '& .MuiDialog-container': {
                    'alignItems': 'flex-start'
                }
            }}
            TransitionProps={{
                onExited: onAnimationExited,
            }}
            >
            <DialogTitle>
                <Grid container spacing={1}>
                    <Grid xs='auto'>
                        <RecordTypeChip label={selectedType.name} bg={selectedType.color} />
                    </Grid>
                    <Grid>
                        Create record
                    </Grid>
                </Grid>


                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>

            </DialogTitle>
            <form onSubmit={handleSubmit(onCreate)}>

                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <Grid container spacing={1}>
                            <Grid xs={6}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='Price'
                                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                            inputProps={{ inputMode: 'numeric' }}
                                            fullWidth
                                            autoComplete="off"
                                            inputMode={'numeric'}
                                            type="number"
                                            autoFocus
                                        />
                                    )}
                                    name='price'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Payment</InputLabel>
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <Select
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                inputRef={ref}
                                                value={value}
                                                name={name}
                                                disabled={disabled}
                                                label="Payment"
                                                fullWidth
                                            >
                                                {payments.map((payment) => (
                                                    <MenuItem key={payment.id} value={payment.id}>{payment.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                        name='payment'
                                        rules={{ required: true }}
                                        control={control}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <Autocomplete
                                            onBlur={onBlur}
                                            onInputChange={(e, v) => { onChange(v) }}
                                            inputRef={ref}
                                            value={value}
                                            inputValue={value}
                                            name={name}
                                            disabled={disabled}
                                            freeSolo
                                            options={suggestedName.map((name) => { return { id: name.id, label: name.name } })}
                                            renderInput={(params) => <TextField {...params} label="Name" />}
                                        // getOptionLabel={(option) => option.name}
                                        // getOptionKey={(option) => option.id}
                                        />
                                    )}
                                    name='name'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            <Grid xs={12}>
                                {/* <TextareaAutosizeElement 
                                    name='description'
                                    label='Description'
                                    fullWidth
                                    rows={2} /> */}
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                    <Button type="submit" variant="contained">Create</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}