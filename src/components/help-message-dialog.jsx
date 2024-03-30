import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton,
    DialogContentText
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from "react"

const HelpMessageDialogProps = {
    open: false,
    title: '幫助',
    children: null,
    onClose: () => {},
}

export default function HelpMessageDialog(props = HelpMessageDialogProps) {
    const {
        open,
        title = HelpMessageDialogProps.title,
        onClose,
        children,
    } = props

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                {title}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>關閉</Button>
            </DialogActions>
        </Dialog>
    )
}