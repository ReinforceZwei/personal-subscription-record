import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton
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
        }
    })

    useEffect(() => {
        setValue('name', payment.name)

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
                Edit Payment

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
                                            label='Name'
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
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={popConfirmDialog}>Delete</Button>
                    <Button onClick={() => setShowThisModal(false)}>Close</Button>
                    <Button type="submit" variant="contained">Save</Button>
                </DialogActions>
            </form>
        </Dialog>

        <ConfirmDeleteDialog 
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={() => onDelete(payment)}
            content="Payment cannot be deleted if the payment is in use."
        />
        </div>
    )
}