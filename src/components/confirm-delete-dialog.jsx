import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'

const ConfirmDeleteDialogProps = {
    open: false,
    title: '確認刪除',
    content: '',
    onClose: () => {},
    onConfirm: () => {},
    confirmActionText: '刪除',
    cancelActionText: '取消',
}

export default function ConfirmDeleteDialog(props = ConfirmDeleteDialogProps) {
    const {
        open = ConfirmDeleteDialogProps.open,
        title = ConfirmDeleteDialogProps.title,
        content = ConfirmDeleteDialogProps.content,
        onClose,
        onConfirm,
        confirmActionText = ConfirmDeleteDialogProps.confirmActionText,
        cancelActionText = ConfirmDeleteDialogProps.cancelActionText,
    } = props

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>{title}</DialogTitle>
            {content && (
                <DialogContent>{content}</DialogContent>
            )}
            <DialogActions>
                <Button onClick={onClose}>{cancelActionText}</Button>
                <Button variant="contained" color='error' onClick={onConfirm}>{confirmActionText}</Button>
            </DialogActions>
        </Dialog>
    )
}