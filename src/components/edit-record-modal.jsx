import { useContext, useEffect, useMemo, useState } from "react"
import {
    Autocomplete, Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select, TextField, 
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import RecordTypeChip from "../components/record-type-chip"
import { useGetSuggestedNameQuery } from "../redux/typeSlice"
import { useGetPaymentsQuery } from "../redux/paymentSlice"
import { useUpdateRecordMutation } from "../redux/recordSlice"

const EditRecordModalProps = {
    record: null,
    onClose: () => {},
}

export default function CreateRecordModal(props = EditRecordModalProps) {
    const { record, onClose } = props

    const [showThisModal, setShowThisModal] = useState(true)

    const { data: suggestedName } = useGetSuggestedNameQuery(record.type)
    const { data: allPayments } = useGetPaymentsQuery()
    const [updateRecord] = useUpdateRecordMutation()
    const payments = useMemo(() => allPayments ? allPayments.filter(x => x.enabled) : [], [allPayments])

    const { handleSubmit, reset, setValue, setFocus, control } = useForm()

    useEffect(() => {
        if (record) {
            reset(record)
        }
    }, [record])

    const onSave = (data) => {
        updateRecord({ id: record.id, data }).unwrap().then(() => {
            setShowThisModal(false)
        }).catch(error => {
            console.error(error)
            alert('Fail to update record')
        })
    }

    return (
        <Dialog open={showThisModal}
            onClose={() => setShowThisModal(false)}
            fullWidth={true}
            maxWidth='sm'
            sx={{
                '& .MuiDialog-container': {
                    'alignItems': 'flex-start'
                }
            }}
            TransitionProps={{
                onExited: onClose,
            }}
            >
            <DialogTitle>
                <Grid container spacing={1}>
                    <Grid xs='auto'>
                        <RecordTypeChip label={record.expand.type.name} bg={record.expand.type.color} />
                    </Grid>
                    <Grid>
                        編輯支出記錄
                    </Grid>
                </Grid>


                <IconButton
                    onClick={() => setShowThisModal(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>

            </DialogTitle>
            <form onSubmit={handleSubmit(onSave)}>

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
                                            label='價錢'
                                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                            inputProps={{ inputMode: 'decimal' }}
                                            fullWidth
                                            autoComplete="off"
                                            inputMode={'decimal'}
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
                                    <InputLabel>支付方式</InputLabel>
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <Select
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                inputRef={ref}
                                                value={value}
                                                name={name}
                                                disabled={disabled}
                                                label="支付方式"
                                                fullWidth
                                            >
                                                {payments.length ? payments.map((payment) => (
                                                    <MenuItem key={payment.id} value={payment.id}>{payment.name}</MenuItem>
                                                )) : (
                                                    <MenuItem key='none' value='' disabled><Box fontStyle='italic'>未設定支付方式</Box></MenuItem>
                                                )}
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
                                            options={suggestedName?.map((name) => { return { id: name.id, label: name.name } }) || []}
                                            renderInput={(params) => <TextField {...params} label="名稱" />}
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
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='描述'
                                            fullWidth
                                            autoComplete="off"
                                            multiline
                                            minRows={2}
                                            maxRows={3}
                                        />
                                    )}
                                    name='description'
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowThisModal(false)}>關閉</Button>
                    <Button type="submit" variant="contained">儲存</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}