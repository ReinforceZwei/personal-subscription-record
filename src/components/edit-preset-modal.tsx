import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, FormControl, InputLabel, InputAdornment, Select, MenuItem, TextField } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import RecordTypeChip from "./RecordType/record-type-chip"
import { PaymentMethod, SpentPreset, SpentType } from "../services/pocketbase"


interface EditPresetModalProps {
    mode: 'edit' | 'create'
    open: boolean
    preset: SpentPreset
    types: SpentType[]
    payments: PaymentMethod[]
    onClose: () => void
    onCreate: (data: FormValues) => void
    onUpdate: (data: FormValues) => void
    onDelete: (data: SpentPreset) => void
}

type FormValues = {
    name?: string,
    payment?: string,
    price?: number,
    type?: string,
    weight: number,
}

export default function EditPresetModal(props: EditPresetModalProps) {
    const {
        mode = 'edit',
        open = false,
        preset,
        types = [],
        payments = [],
        onClose,
        onCreate,
        onUpdate,
        onDelete,
    } = props

    const enabledTypes = useMemo(() => types ? types.filter(x => x.enabled) : [], [types])
    const enabledPayments = useMemo(() => payments ? payments.filter(x => x.enabled) : [], [payments])

    const [internalShow, setInternalShow] = useState(open)
    const { handleSubmit, reset, setValue, setFocus, control } = useForm<FormValues>({
        defaultValues: {
            name: '',
            payment: '',
            type: '',
            weight: 100,
        }
    })

    useEffect(() => {
        if (mode === 'edit') {
            reset({
                name: preset.name,
                payment: preset.payment,
                price: preset.price,
                type: preset.type,
                weight: preset.weight,
            })
        }
        
    }, [preset, mode])

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
                { mode === 'edit' ? '編輯預設範本' : '建立預設範本'}
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
                        <FormControl fullWidth>
                            <InputLabel>類別</InputLabel>
                            <Controller
                                render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                    <Select
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        inputRef={ref}
                                        value={value}
                                        name={name}
                                        disabled={disabled}
                                        label="類別"
                                        fullWidth
                                    >
                                        <MenuItem key='none' value=''><Box fontStyle='italic'>不設定</Box></MenuItem>
                                        {enabledTypes && enabledTypes.map((type) => (
                                            <MenuItem key={type.id} value={type.id}><RecordTypeChip label={type.name} bg={type.color} /></MenuItem>
                                        ))}
                                    </Select>
                                )}
                                name='type'
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
                                    label='名稱'
                                    fullWidth
                                    autoComplete="off"
                                    autoFocus
                                />
                            )}
                            name='name'
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
                                    autoFocus
                                />
                            )}
                            name='price'
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
                                    label='權重'
                                    inputProps={{ inputMode: 'numeric' }}
                                    fullWidth
                                    autoComplete="off"
                                    inputMode={'numeric'}
                                    type="number"
                                />
                            )}
                            name='weight'
                            rules={{ required: true }}
                            control={control}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            

            <DialogActions>
                {mode === 'edit' && (<Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={() => onDelete(preset)}>刪除</Button>)}
                <Button onClick={() => setInternalShow(false)}>關閉</Button>
                <Button type="submit" variant="contained">{mode === 'edit' ? '儲存' : '建立'}</Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}