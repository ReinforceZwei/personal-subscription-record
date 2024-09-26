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

interface CreatePaymentModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: FormValues) => void
}

type FormValues = {
    name: string
    weight: number
}

export default function CreatePaymentModal(props: CreatePaymentModalProps) {
    const { open, onClose, onSubmit } = props

    const [showThisModal, setShowThisModal] = useState(open)

    const { handleSubmit, reset, setValue, setFocus, control } = useForm<FormValues>({
        defaultValues: {
            name: '',
            weight: 100,
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
                建立支付方式

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
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setShowThisModal(false)}>關閉</Button>
                    <Button type="submit" variant="contained">建立</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}