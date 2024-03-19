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

import { PAYMENT_METHOD_COL, SPENT_RECORD_NAME_COL } from "../services/pocketbase"
import RecordTypeChip from "../components/record-type-chip"

export const CreateRecordModalProps = {
    selectedType: null,
    open: false,
    onClose: () => {},
    onCreate: (data) => {},
}

export default function CreateRecordModal(props = CreateRecordModalProps) {
    const { selectedType, open, onClose, onCreate, ...other } = props

    const pb = useContext(PocketBaseContext)

    const [suggestedName, setSuggestedName] = useState([])
    const [payments, setPayments] = useState([])

    const { handleSubmit, reset, setValue, setFocus, control } = useForm({
        defaultValues: {
            name: '',
            payment: '',
            price: '',
        }
    })

    useEffect(() => {
        (async () => {
            let names = await pb.collection(SPENT_RECORD_NAME_COL).getFullList({
                sort: '+name',
                filter: `type = '${selectedType.id}'`
            })
            setSuggestedName(names)
            console.log(names)

            let paymentMethods = await pb.collection(PAYMENT_METHOD_COL).getFullList({
                sort: '+name',
            })
            setPayments(paymentMethods)
        })()
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
            }}>
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
                                {/* FIXME: numeric input not work */}
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
                                                    <MenuItem value={payment.id}>{payment.name}</MenuItem>
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