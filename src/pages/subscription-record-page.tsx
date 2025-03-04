import Grid from '@mui/material/Grid2'
import { Box, Button, Card, CardContent, List, ListItemButton, ListItemText, Typography, IconButton, Divider } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'
import { useAddSubscriptionMutation, useDeleteSubscriptionMutation, useGetSubscriptionsQuery, useUpdateSubscriptionMutation } from '../redux/subscriptionSlice';
import { useMemo, useState } from 'react';
import EditSubscriptionModal from '../components/SubscriptionModal/edit-subscription-modal';
import { useGetPaymentsQuery } from '../redux/paymentSlice';
import ConfirmDeleteDialog from '../components/confirm-delete-dialog';
import { sumBy, add, subtract } from '../vendors/fixedPointMath'
import { useGetBudgetQuery } from '../redux/budgetSlice';
import { DateTime } from 'luxon';
import HelpMessageDialog from '../components/help-message-dialog';
import _ from 'lodash-es'
import { SubscriptionPlan } from '../services/pocketbase';

export default function SubscriptionRecordPage() {

    const { data: subscriptions } = useGetSubscriptionsQuery()
    const { data: payments } = useGetPaymentsQuery()
    const { data: budget } = useGetBudgetQuery({date: DateTime.now().endOf('month').toISO(), type: 'subscription'})
    const [addSubscription] = useAddSubscriptionMutation()
    const [updateSubscription] = useUpdateSubscriptionMutation()
    const [deleteSubscription] = useDeleteSubscriptionMutation()

    const activeSubscriptions = useMemo(() => subscriptions ? subscriptions.filter(x => x.active) : [], [subscriptions])
    const inactiveSubscriptions = useMemo(() => subscriptions ? subscriptions.filter(x => !x.active) : [], [subscriptions])
    const priceSum = useMemo(() => {
        return activeSubscriptions.reduce((p, c) => {
            return _.round(add(p, c.price / (c.renew_period_month || 1)), 2)
        }, 0)
    }, [activeSubscriptions])
    const balance = useMemo(() => budget ? subtract(budget.budget, priceSum) : null, [budget, priceSum])

    const [editModal, setEditModal] = useState<{ mode: 'edit' | 'create', open: boolean, subscription: SubscriptionPlan | null }>({
        mode: 'edit',
        open: false,
        subscription: null,
    })

    const [showHelp, setShowHelp] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

    const handleCreate = (data: Partial<SubscriptionPlan>) => {
        addSubscription(data)
            .unwrap()
            .then(() => {
                setEditModal({...editModal, open: false, subscription: null})
            })
            .catch(err => {
                console.error(err)
                alert(err)
            })
    }

    const handleUpdate = (data: Partial<SubscriptionPlan>) => {
        updateSubscription({ id: editModal.subscription!.id, data })
            .unwrap()
            .then(() => {
                setEditModal({...editModal, open: false, subscription: null})
            })
            .catch(err => {
                console.error(err)
                alert(err)
            })
    }

    const handleDelete = (data: Partial<SubscriptionPlan>) => {
        setConfirmDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        deleteSubscription(editModal.subscription!.id)
            .unwrap()
            .then(() => {
                setConfirmDeleteModal(false)
                setEditModal({...editModal, open: false, subscription: null})
            })
            .catch(err => {
                console.error(err)
                alert(err)
            })
    }

    return (
        <Box sx={{mb: 10, mt: 1}}>
            <Grid container columns={{ xs: 8, sm: 12 }} spacing={1}>
                
                <Grid size={4}>
                    <Card>
                        <CardContent>
                            <Typography>總金額（月）</Typography>
                            <Typography variant='h5'>${priceSum}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={4}>
                    <Card>
                        <CardContent>
                            <Typography>餘額</Typography>
                            <Typography
                                variant='h5' 
                                sx={{
                                    color: (balance || 0) < 0 ? 'error.main' : 'success.main',
                                }}
                            >${balance || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardContent>
                            <Typography>預算</Typography>
                            <Typography variant='h5'>${budget?.budget || '---'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                { budget && (
                <Grid height='100%' size={4}>
                    <PieChart
                        series={[{
                            data: [
                                { id: 0, value: (priceSum) , label: '已訂閱', color: 'red'},
                                { id: 1, value: (balance || 0) , label: '餘額', color: 'green'},
                            ]
                        }]}
                        height={100}
                    />
                </Grid>
                )}
            </Grid>
            <Box mt={2} display='flex' justifyContent='space-between'>
                <Button variant="outlined" onClick={() => setEditModal({...editModal, open: true, mode: 'create'})} startIcon={<AddIcon />} >建立訂閱記錄</Button>
                <IconButton onClick={() => setShowHelp(true)}><HelpIcon /></IconButton>
            </Box>
            <Box>
                <List>
                {activeSubscriptions && activeSubscriptions.map((subs) => (
                    <ListItemButton key={subs.id} onClick={() => setEditModal({...editModal, open: true, mode: 'edit', subscription: subs})}>
                        <ListItemText primary={subs.name} secondary={'每' + (subs.renew_period_month > 1 ? subs.renew_period_month+'個' : '') + '月續費'} />
                        ${subs.price}
                    </ListItemButton>
                ))}
                </List>
            </Box>
            { (inactiveSubscriptions && !!inactiveSubscriptions.length) && (
                <Box>
                    <Divider>已取消</Divider>
                    { inactiveSubscriptions.map((subs) => (
                        <ListItemButton key={subs.id} onClick={() => setEditModal({...editModal, open: true, mode: 'edit', subscription: subs})}>
                            <ListItemText primary={subs.name} secondary={'每' + (subs.renew_period_month > 1 ? subs.renew_period_month+'個' : '') + '月續費'} />
                            ${subs.price}
                        </ListItemButton>
                    )) }
                </Box>
            ) }
            { editModal.open && (
                <EditSubscriptionModal
                    open={editModal.open}
                    mode={editModal.mode}
                    subscription={editModal.subscription!}
                    payments={payments!}
                    onClose={() => setEditModal({...editModal, open: false})}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            ) }
            { confirmDeleteModal && (
                <ConfirmDeleteDialog open={confirmDeleteModal} onClose={() => setConfirmDeleteModal(false)} onConfirm={() => handleConfirmDelete()} />
            )}
            <HelpMessageDialog open={showHelp} onClose={() => setShowHelp(false)}>
                <Typography variant="h6" color='common.white'>訂閱記錄</Typography>
                <Typography variant="body1">記錄訂閱中的項目。訂閱支出不會記錄到消費記錄。</Typography>
            </HelpMessageDialog>
        </Box>
    );
}