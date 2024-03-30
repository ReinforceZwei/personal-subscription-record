import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton, FormControlLabel, Switch
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import ConfirmDeleteDialog from "./confirm-delete-dialog"

const EditPaymentModalProps = {
    open: false,
    payment: null,
    onClose: () => {},
    onUpdate: (data) => {},
    onDelete: (payment) => {},
}

export default function EditPaymentModal(props = EditPaymentModalProps) {
    const { open, payment, onClose, onUpdate, onDelete } = props

    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const [showThisModal, setShowThisModal] = useState(open)

    const { handleSubmit, reset, setValue, setFocus, control } = useForm({
        defaultValues: {
            name: '',
            enabled: true,
        }
    })

    useEffect(() => {
        setValue('name', payment.name)
        setValue('enabled', payment.enabled)
        setValue('weight', payment.weight)

        setTimeout(() => {
            setFocus('name')
        }, 1)
    }, [])

    const popConfirmDialog = () => {
        setShowConfirmDialog(true)
    }

    return (
        <div>
        <Dialog
            open={showThisModal}
            onClose={() => setShowThisModal(false)}
            fullWidth
            maxWidth='sm'
            sx={{
                '& .MuiDialog-container': {
                    'alignItems': 'flex-start'
                }
            }}
            TransitionProps={{
                onExited: onClose
            }}
        >
            <DialogTitle>
                編輯支付方式

                <IconButton
                    onClick={() => setShowThisModal(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onUpdate)}>
                <DialogContent>
                    <Box>
                        <Grid container spacing={1}>
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
                            <Grid xs={12}>
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
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={popConfirmDialog}>刪除</Button>
                    <Button onClick={() => setShowThisModal(false)}>關閉</Button>
                    <Button type="submit" variant="contained">儲存</Button>
                </DialogActions>
            </form>
        </Dialog>

        <ConfirmDeleteDialog 
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={() => onDelete(payment)}
            content="如支付方式已被使用，則無法刪除"
        />
        </div>
    )
}