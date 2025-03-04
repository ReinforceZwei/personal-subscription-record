import { useContext, useEffect, useMemo, useState } from "react"
import {
    Autocomplete, Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select, TextField, 
} from "@mui/material"
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import RecordTypeChip from "../RecordType/record-type-chip"
import { useGetSuggestedNameQuery } from "../../redux/typeSlice"
import { useGetPaymentsQuery } from "../../redux/paymentSlice"
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CurrencyCalculatorModal from "../CurrencyCalculator/currency-calculator-modal"
import { SpentPreset, SpentType } from "../../services/pocketbase"

interface CreateRecordModalProps {
    selectedType: SpentType,
    preset: SpentPreset,
    open: boolean,
    onClose: () => void,
    onCreate: (data: FormValues) => Promise<void>,
}

type FormValues = {
    name: string
    payment: string
    price: number
    description?: string
}

export default function CreateRecordModal(props: CreateRecordModalProps) {
    const { selectedType, preset, open, onClose, onCreate } = props

    const [showThisModal, setShowThisModal] = useState(open)
    const [showCalc, setShowCalc] = useState(false)

    const { data: suggestedName } = useGetSuggestedNameQuery(selectedType?.id)
    const { data: allPayments } = useGetPaymentsQuery()
    const payments = useMemo(() => allPayments ? allPayments.filter(x => x.enabled) : [], [allPayments])

    const { handleSubmit, reset, setValue, setFocus, control, formState: { isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            name: '',
            payment: '',
        }
    })

    const handleCalcResult = (price: number) => {
        setValue('price', price)
        setShowCalc(false)
    }

    useEffect(() => {
        if (payments.length) {
            if (preset && preset.payment) {
                setValue('payment', preset.payment)
            } else {
                if (selectedType.default_payment) {
                    setValue('payment', selectedType.default_payment)
                } else {
                    setValue('payment', payments[0].id)
                }
            }
        }
        if (preset) {
            if (preset.name) setValue('name', preset.name)
            if (preset.price) setValue('price', preset.price)
        }

        setTimeout(() => {
            setFocus('price')
        }, 1)
    }, [payments, preset])

    return (
        <>
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
                        <Grid size='auto'>
                            <RecordTypeChip label={selectedType.name} bg={selectedType.color} />
                        </Grid>
                        <Grid>
                            建立支出記錄
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
                <form onSubmit={handleSubmit(onCreate)}>

                    <DialogContent>
                        <Box sx={{ pt: 1 }}>
                            <Grid container spacing={1}>
                                <Grid size={6}>
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
                                <Grid size={6}>
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
                                <Grid size={12}>
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
                                <Grid size={12}>
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
                        <IconButton onClick={() => setShowCalc(true)}><CurrencyExchangeIcon /></IconButton>
                        <span style={{flex: '1 1'}}></span>
                        <Button onClick={() => setShowThisModal(false)}>關閉</Button>
                        <Button type="submit" variant="contained" loading={isSubmitting}>建立</Button>
                    </DialogActions>
                </form>
            </Dialog>
            { showCalc && <CurrencyCalculatorModal acceptResult onResult={handleCalcResult} onClose={() => setShowCalc(false)} />}
        </>
    );
}