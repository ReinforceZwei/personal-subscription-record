import { Dialog, DialogContent, DialogTitle, DialogActions, List, ListItem, ListItemText, Button, IconButton, Paper, Card, CardContent, Typography, Box } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import RecordTypeChip from "./record-type-chip"
import { DateTime } from "luxon"
import Grid from '@mui/material/Unstable_Grid2'

const recordDetailModalProps = {
    record: null,
    open: false,
    onClose: () => {}
}

export default function RecordDetailModal(props = recordDetailModalProps) {
    const { record, open, onClose } = props

    console.log(record)

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth='sm'>
            <DialogTitle>
                Record Details

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
                                <RecordTypeChip label={record.expand.type.name} bg={record.expand.type.color} sx={{mr: 1}} />
                                <ListItemText primary={record.name} secondary={DateTime.fromSQL(record.created).toLocaleString(DateTime.DATETIME_SHORT)} />
                            </ListItem>
                        </Paper>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">Price</Typography>
                            <Typography variant="h6">${record.price}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">Payment</Typography>
                            <Typography variant="h6">{record.expand.payment?.name || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={12}>
                        <Box sx={{padding: 2}}>
                            Description
                            <Typography variant="subtitle1">{record.description || '---'}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}