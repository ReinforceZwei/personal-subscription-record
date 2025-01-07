import { Dialog, DialogContent, DialogTitle, DialogActions, List, ListItem, ListItemText, Button, IconButton, Paper, Card, CardContent, Typography, Box } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import RecordTypeChip from "../RecordType/record-type-chip"
import { DateTime } from "luxon"
import Grid from '@mui/material/Unstable_Grid2'
import EditRecordModal from './edit-record-modal'
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { SpentRecord } from "../../services/pocketbase";

interface RecordDetailModalProps {
    record: SpentRecord
    open: boolean
    onClose: () => void
}

export default function RecordDetailModal(props: RecordDetailModalProps) {
    const { record, open, onClose } = props

    const [showEditModal, setShowEditModal] = useState(false)

    return (
        <>
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
            <DialogTitle>
                支出詳情

                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                ><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent>
                {record && (
                <Grid container spacing={1}>
                    <Grid xs={12}>
                        <Paper elevation={1}>
                            <ListItem>
                                <RecordTypeChip label={record.expand?.type.name} bg={record.expand?.type.color} sx={{mr: 1}} />
                                <ListItemText primary={record.name} secondary={DateTime.fromSQL(record.created).toLocaleString(DateTime.DATETIME_SHORT)} />
                            </ListItem>
                        </Paper>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">價錢</Typography>
                            <Typography variant="h6">${record.price}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">支付方式</Typography>
                            <Typography variant="h6">{record.expand?.payment?.name || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={12}>
                        <Box sx={{padding: 2}}>
                            描述
                            <Typography variant="subtitle1">{record.description || '---'}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setShowEditModal(true)}>編輯</Button>
                <Button onClick={onClose}>關閉</Button>
            </DialogActions>
        </Dialog>

        { showEditModal && <EditRecordModal record={record} onClose={() => setShowEditModal(false)} /> }
        </>
    )
}