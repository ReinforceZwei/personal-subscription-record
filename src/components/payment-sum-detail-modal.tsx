import { Dialog, DialogContent, DialogTitle, DialogActions, Button, IconButton, Typography, Box } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2'
import { useState } from "react";
import SpentRecordList from "./SpendRecord/spent-record-list";
import { SpentRecord, PaymentMethod } from "../services/pocketbase";

interface PaymentSumDetailModalProps {
    payment: PaymentMethod
    paymentSum: number
    records: SpentRecord[]
    open: boolean
    onClose: () => void
}

export default function PaymentSumDetailModal(props: PaymentSumDetailModalProps) {
    const { payment, paymentSum, records, open, onClose } = props

    const [internalShow, setInternalShow] = useState(open)

    return (
        <Dialog open={internalShow} onClose={() => setInternalShow(false)} fullWidth={true} maxWidth='sm' TransitionProps={{onExited: () => {onClose()}}}>
            <DialogTitle>
                詳細資料

                <IconButton
                    onClick={() => setInternalShow(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                ><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                {payment && (
                <Grid container spacing={1}>
                    <Grid size={12}>
                        <Box display='flex' justifyContent='center'>
                            <Typography variant="h4">{payment.name}</Typography>
                        </Box>
                    </Grid>

                    <Grid size={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">總支出</Typography>
                            <Typography variant="h6">${paymentSum || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid size={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">記錄</Typography>
                            <Typography variant="h6">{records?.length || '---'}筆</Typography>
                        </Box>
                    </Grid>

                    <Grid size={12}>
                        <SpentRecordList records={records} />
                    </Grid>
                </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setInternalShow(false)}>關閉</Button>
            </DialogActions>
        </Dialog>
    );
}