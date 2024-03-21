import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"

const CreatePaymentModalProps = {
    open: false,
    onClose: () => {},
    onSubmit: () => {},
}

export default function CreatePaymentModal(props = CreatePaymentModalProps) {
    const { open, onClose, onSubmit } = props

    const [showThisModal, setShowThisModal] = useState(open)

    const { handleSubmit, reset, setValue, setFocus, control } = useForm({
        defaultValues: {
            name: '',
        }
    })

    useEffect(() => {
        setTimeout(() => {
            setFocus('name')
        }, 1)
    }, [])

    return (
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
                Create Payment

                <IconButton
                    onClick={() => setShowThisModal(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <Button onClick={() => setShowThisModal(false)}>Close</Button>
                    <Button type="submit" variant="contained">Create</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}