import { Dialog, DialogContent, DialogTitle, DialogActions, List, ListItem, ListItemText, Button, IconButton, Paper, Card, CardContent, Typography, Box } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from "react";
import RecordTypeCard from "./record-type-card";

const TypeSumDetailModalProps = {
    type: null,
    typeSum: 0,
    open: false,
    onClose: () => {}
}

export default function TypeSumDetailModal(props = TypeSumDetailModalProps) {
    const { type, typeSum, open, onClose } = props

    const [internalShow, setInternalShow] = useState(open)

    return (
        <Dialog open={internalShow} onClose={() => setInternalShow(false)} fullWidth={true} maxWidth='sm' TransitionProps={{onExited: () => {onClose()}}}>
            <DialogTitle>
                Details

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
                {type && (
                <Grid container spacing={1}>
                    <Grid xs={12}>
                        <RecordTypeCard bg={type.color} >{type.name}</RecordTypeCard>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">Total</Typography>
                            <Typography variant="h6">${typeSum || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">Monthly Budget</Typography>
                            <Typography variant="h6">${type.budget_per_month || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={12}>
                        <Box sx={{padding: 2}}>
                            <Typography variant="subtitle1">Balance</Typography>
                            {type.budget_per_month ? (
                                <Typography variant="h6"
                                    sx={{
                                        color: (type.budget_per_month - typeSum) < 0 ? 'error.main' : 'success.main',
                                    }}
                                >${type.budget_per_month - typeSum || '---'}</Typography>
                            ) : (
                                <Typography variant="h6">$---</Typography>
                            )}
                            
                        </Box>
                    </Grid>
                </Grid>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setInternalShow(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}