import { Dialog, DialogContent, DialogTitle, DialogActions, List, ListItem, ListItemText, Button, IconButton, Paper, Card, CardContent, Typography, Box } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Unstable_Grid2'
import { useState } from "react";
import RecordTypeCard from "./record-type-card";

const TypeSumDetailModalProps = {
    type: null,
    typeSum: 0,
    records: [],
    open: false,
    onClose: () => {}
}

export default function TypeSumDetailModal(props = TypeSumDetailModalProps) {
    const { type, typeSum, records, open, onClose } = props

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
                {type && (
                <Grid container spacing={1}>
                    <Grid xs={12}>
                        <RecordTypeCard bg={type.color} >{type.name}</RecordTypeCard>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">記錄</Typography>
                            <Typography variant="h6">{records?.length || '---'}筆</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">總支出</Typography>
                            <Typography variant="h6">${typeSum || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{height: '100%', padding: 2}}>
                            <Typography variant="subtitle1">每月預算</Typography>
                            <Typography variant="h6">${type.budget_per_month || '---'}</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{padding: 2}}>
                            <Typography variant="subtitle1">餘額</Typography>
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
                <Button onClick={() => setInternalShow(false)}>關閉</Button>
            </DialogActions>
        </Dialog>
    )
}