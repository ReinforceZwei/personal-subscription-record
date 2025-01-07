import {
    Box, Button, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, 
    DialogContentText
} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import { ReactNode } from "react"

interface HelpMessageDialogProps {
    open: boolean
    title?: string
    children?: ReactNode
    onClose: () => void
}

export default function HelpMessageDialog(props: HelpMessageDialogProps) {
    const {
        open,
        title = '幫助',
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