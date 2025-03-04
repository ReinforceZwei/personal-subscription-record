import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from "react-hook-form";
import RecordTypeCard from "../RecordType/record-type-card";
import { useContext, useEffect, useMemo, useState } from "react";
import { SwatchesPicker, ChromePicker } from 'react-color'
import { useAddTypeMutation, useDeleteTypeMutation, useUpdateTypeMutation } from "../../redux/typeSlice";
import ConfirmDeleteDialog from "../confirm-delete-dialog";
import { SpentType } from "../../services/pocketbase";
import { PocketBaseContext } from "../../context";
import { useGetPaymentsQuery } from "../../redux/paymentSlice";

interface RecordTypeDialogProps {
    open: boolean
    onClose?: () => void
    modalType: 'edit' | 'create'
    spentType?: SpentType
}

type FormValues = {
    name: string
    color?: string
    enabled: boolean
    weight: number
    budget_per_month: number
    default_payment?: string
}

export default function RecordTypeDialog(props: RecordTypeDialogProps) {
    const { open, onClose, modalType, spentType } = props
    const pb = useContext(PocketBaseContext)

    if (modalType === 'edit' && !spentType) {
        throw new Error('Model type is set to edit but spent type is empty. Please provide spent type')
    }

    const { data: payments } = useGetPaymentsQuery()
    const enabledPayments = useMemo(() => payments ? payments.filter(x => x.enabled) : [], [payments])

    const [addType] = useAddTypeMutation()
    const [updateType] = useUpdateTypeMutation()
    const [deleteType] = useDeleteTypeMutation()

    const [showModal, setShowModal] = useState<boolean>(open)
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
    const [colorInputType, setColorInputType] = useState<'custom' | 'palette'>('palette')

    const { handleSubmit, reset, setValue, setFocus, watch, control } = useForm<FormValues>({
        defaultValues: {
            weight: 100,
            budget_per_month: 0,
        }
    })
    const watchName = watch('name')
    const watchColor = watch('color')

    useEffect(() => {
        if (modalType === 'create') {
            setTimeout(() => {
                setFocus('name')
            }, 1)
        }
    }, [])

    useEffect(() => {
        if (modalType === 'edit') {
            reset(spentType)
        }
    }, [spentType, modalType])

    const handleDeleteType = () => {
        setShowConfirmDelete(true)
    }


    const onSave = (data: FormValues) => {
        let final = {
            owned_by: spentType!.owned_by,
            icon: spentType!.icon,
            name: data.name,
            color: data.color?.hex,
            enabled: data.enabled,
            weight: data.weight,
            budget_per_month: data.budget_per_month,
            default_payment: data.default_payment,
        }
        updateType({ id: spentType!.id, data: final })
            .unwrap()
            .then(() => {
                setShowModal(false)
            })
            .catch((err) => {
                alert(err)
                console.log(err)
            })
    }

    const onCreate = (data: FormValues) => {
        let final = {
            owned_by: pb!.authStore.model!.id,
            icon: '',
            name: data.name,
            color: data.color?.hex,
            enabled: true,
            weight: data.weight,
            budget_per_month: data.budget_per_month,
            default_payment: data.default_payment,
        }
        addType(final)
            .unwrap()
            .then(() => {
                setShowModal(false)
            })
            .catch((err) => {
                alert(err)
                console.log(err)
            })
    }

    const onDelete = () => {
        deleteType(spentType!.id)
            .unwrap()
            .then(() => {
                setShowConfirmDelete(false)
                setShowModal(false)
            })
            .catch((err) => {
                //alert(err)
                alert('類別已被使用，無法刪除')
                console.log(err)
            })
    }

    return (
        <>
            <Dialog open={showModal}
                onClose={() => setShowModal(false)}
                fullWidth={true}
                maxWidth='sm'
                sx={{
                    '& .MuiDialog-container': {
                        'alignItems': 'flex-start'
                    }
                }}
                slotProps={{
                    transition: {
                        onExited: () => onClose(),
                    }
                }}
            >
                <DialogTitle>
                    <Grid container spacing={1}>
                        <Grid>
                            {modalType === 'edit' && '編輯類別'}
                            {modalType === 'create' && '建立新類別'}
                        </Grid>
                    </Grid>
                    
                    
                    <IconButton
                        onClick={() => setShowModal(false)}
                        sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,}}><CloseIcon /></IconButton>
                    
                </DialogTitle>
                <form onSubmit={modalType === 'edit' ? handleSubmit(onSave) : handleSubmit(onCreate)}>
                
                <DialogContent>
                    <Box sx={{pt: 1}}>
                        <Grid container spacing={1}>
                            <Grid size={8}>
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

                            <Grid size={4}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='預算'
                                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                            inputProps={{ inputMode: 'decimal' }}
                                            fullWidth
                                            autoComplete="off"
                                            inputMode={'decimal'}
                                            type="number"
                                        />
                                    )}
                                    name='budget_per_month'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>

                            <Grid size={8}>
                                <FormControl fullWidth>
                                    <InputLabel>預設支付方式</InputLabel>
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <Select
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                inputRef={ref}
                                                value={value}
                                                name={name}
                                                disabled={disabled}
                                                label="預設支付方式"
                                                fullWidth
                                            >
                                                <MenuItem key='none' value=''><Box fontStyle='italic'>無</Box></MenuItem>
                                                {!!enabledPayments.length && enabledPayments.map((payment) => (
                                                    <MenuItem key={payment.id} value={payment.id}>{payment.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                        name='default_payment'
                                        control={control}
                                    />
                                </FormControl>
                            </Grid>
                            
                            
                            <Grid size={4}>
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
                            {modalType === 'edit' && (
                                <Grid size={8}>
                                    <Box display='flex' alignContent='center' height='100%' justifyContent='flex-end'>
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
                                                label="已啟用"
                                            />
                                        )}
                                        name='enabled'
                                        control={control}
                                    />
                                    </Box>
                                </Grid>
                            )}
                            <Grid size={12}>
                                <InputLabel>顏色</InputLabel>
                                <ToggleButtonGroup value={colorInputType} exclusive size="small" onChange={(e, v) => setColorInputType(v)}>
                                    <ToggleButton value='palette'>調色盤</ToggleButton>
                                    <ToggleButton value='custom'>自定義</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid size={12}>
                                {colorInputType === 'palette' && (
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <SwatchesPicker color={value} onChange={onChange} width='auto' />
                                        )}
                                        name='color'
                                        control={control}
                                    />
                                )}
                                {colorInputType === 'custom' && (
                                    <Box display='flex' justifyContent='center' sx={{textAlign: 'center'}}>
                                        <Controller
                                            render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                                <ChromePicker color={value} onChange={onChange} disableAlpha />
                                            )}
                                            name='color'
                                            control={control}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} justifyContent='center'>
                            <Grid size={12}>
                                <Divider><Typography variant="overline">預覽</Typography></Divider>
                            </Grid>
                            <Grid size={6}>
                            
                                <Box sx={{textAlign: 'center'}}>
                                    <RecordTypeCard bg={watchColor?.hex || spentType?.color} colorTransition={200}>
                                        {watchName || spentType?.name || '---'}
                                    </RecordTypeCard>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {modalType === 'edit' && (<Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={handleDeleteType}>刪除</Button>)}
                    <Button onClick={() => setShowModal(false)}>關閉</Button>
                    <Button type="submit" variant="contained">{modalType === 'edit' ? '儲存' : '建立'}</Button>
                </DialogActions>
                </form>
            </Dialog>
            <ConfirmDeleteDialog
                open={showConfirmDelete}
                title='刪除類別？'
                content='如類別已被使用，則無法刪除'
                onClose={() => setShowConfirmDelete(false)}
                onConfirm={() => onDelete()}
            />
        </>
    );
}