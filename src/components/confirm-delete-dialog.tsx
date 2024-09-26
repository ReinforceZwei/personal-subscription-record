import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'

const defaultProps = {
    open: false,
    title: '確認刪除',
    content: '',
    confirmActionText: '刪除',
    cancelActionText: '取消',
}

interface ConfirmDeleteDialogProps {
    open: boolean
    title?: string
    content?: string
    onClose: () => void
    onConfirm: () => void
    confirmActionText?: string
    cancelActionText?: string
}

export default function ConfirmDeleteDialog(props: ConfirmDeleteDialogProps) {
    const {
        open = defaultProps.open,
        title = defaultProps.title,
        content = defaultProps.content,
        onClose,
        onConfirm,
        confirmActionText = defaultProps.confirmActionText,
        cancelActionText = defaultProps.cancelActionText,
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