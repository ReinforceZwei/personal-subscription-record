import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, FormControl, InputLabel,
    InputAdornment, Select, MenuItem, TextField,
    FormControlLabel, Switch,
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { PaymentMethod, SubscriptionPlan } from "../../services/pocketbase"


interface EditSubscriptionModalProps {
    mode: 'edit' | 'create'
    open: boolean
    subscription: SubscriptionPlan
    payments: PaymentMethod[]
    onClose: () => void
    onCreate: (data: FormValues) => void
    onUpdate: (data: FormValues) => void
    onDelete: (data: SubscriptionPlan) => void
}

type FormValues = {
    name: string
    payment?: string
    price: number
    active: boolean
    description?: string
    renew_period_month: number
}

export default function EditSubscriptionModal(props: EditSubscriptionModalProps) {
    const {
        mode = 'edit',
        open = false,
        subscription,
        payments = [],
        onClose,
        onCreate,
        onUpdate,
        onDelete,
    } = props

    const enabledPayments = useMemo(() => payments ? payments.filter(x => x.enabled) : [], [payments])

    const [internalShow, setInternalShow] = useState(open)
    const { handleSubmit, reset, setValue, setFocus, control } = useForm<FormValues>({
        defaultValues: {
            name: '',
            payment: '',
            active: true,
            description: '',
            renew_period_month: 1,
        }
    })

    useEffect(() => {
        if (mode === 'edit') {
            reset({
                name: subscription.name,
                payment: subscription.payment,
                price: subscription.price,
                active: subscription.active,
                description: subscription.description,
                renew_period_month: subscription.renew_period_month,
            })
        }
        
    }, [subscription, mode])

    useEffect(() => {
        if (mode === 'create')
            setTimeout(() => setFocus('name'), 0)
    }, [setFocus, mode])


    return (
        <Dialog
            open={internalShow}
            onClose={() => setInternalShow(false)}
            TransitionProps={{
                onExited: () => onClose(),
            }}
            fullWidth={true}
            maxWidth='sm'
            sx={{
                '& .MuiDialog-container': {
                    'alignItems': 'flex-start'
                }
            }}
        >
            <DialogTitle>
                { mode === 'edit' ? '編輯訂閱記錄' : '建立訂閱記錄'}
                <IconButton
                    onClick={() => setInternalShow(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>
            </DialogTitle>
            
            <form onSubmit={handleSubmit((mode === 'edit' ? onUpdate : onCreate))}>
            <DialogContent>
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
                                    label='名稱'
                                    fullWidth
                                    autoComplete="off"
                                    autoFocus
                                />
                            )}
                            name='name'
                            rules={{ required: true }}
                            control={control}
                        />
                    </Grid>
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
                                        <MenuItem key='none' value=''><Box fontStyle='italic'>不設定</Box></MenuItem>
                                        {enabledPayments && enabledPayments.map((payment) => (
                                            <MenuItem key={payment.id} value={payment.id}>{payment.name}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                                name='payment'
                                control={control}
                            />
                        </FormControl>
                    </Grid>
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
                                    label='續費週期（月）'
                                    inputProps={{ inputMode: 'numeric' }}
                                    fullWidth
                                    autoComplete="off"
                                    inputMode={'numeric'}
                                    type="number"
                                />
                            )}
                            name='renew_period_month'
                            rules={{ required: true }}
                            control={control}
                        />
                    </Grid>
                    <Grid xs={12}>
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
                                    maxRows={2}
                                />
                            )}
                            name='description'
                            control={control}
                        />
                    </Grid>
                    
                    <Grid xs={6}>
                        <Controller
                            render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={value}
                                            inputRef={ref}
                                            name={name}
                                            disabled={disabled}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                        />
                                    }
                                    label="訂閱中"
                                />
                            )}
                            name='active'
                            control={control}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            

            <DialogActions>
                {mode === 'edit' && (<Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={() => onDelete(subscription)}>刪除</Button>)}
                <Button onClick={() => setInternalShow(false)}>關閉</Button>
                <Button type="submit" variant="contained">{mode === 'edit' ? '儲存' : '建立'}</Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}