import {
    Box, Button, List, ListItem, IconButton,
    Typography,
    ListItemButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ListItemText
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'
import { useContext, useEffect, useMemo, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useAddPaymentMutation, useDeletePaymentMutation, useGetPaymentsQuery, useUpdatePaymentMutation } from "../../redux/paymentSlice"
import CreatePaymentModal from "../../components/PaymentModal/create-payment-modal"
import EditPaymentModal from "../../components/PaymentModal/edit-payment-modal"
import { PocketBaseContext } from "../../context"
import HelpMessageDialog from "../../components/help-message-dialog"
import { PaymentMethod } from "../../services/pocketbase"

export default function ConfigPaymentPage() {
    const pb = useContext(PocketBaseContext)!

    const { data: payments } = useGetPaymentsQuery()
    const [addPayment] = useAddPaymentMutation()
    const [updatePayment] = useUpdatePaymentMutation()
    const [deletePayment] = useDeletePaymentMutation()

    const enabledPayments = useMemo(() => payments ? payments.filter(x => x.enabled) : [], [payments])
    const disabledPayments = useMemo(() => payments ? payments.filter(x => !x.enabled) : [], [payments])
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showHelp, setShowHelp] = useState(false)


    const handleCreatePayment = () => {
        setShowCreateModal(true)
    }

    const handleEditPayment = (payment: PaymentMethod) => {
        setSelectedPayment(payment)
        setShowEditModal(true)
    }

    const onCreate = (data: Partial<PaymentMethod>) => {
        console.log('onCreate', data)
        const final = {
            name: data.name,
            icon: '',
            color: '',
            owned_by: pb.authStore.model?.id,
            enabled: true,
            weight: data.weight,
        }
        addPayment(final)
            .unwrap()
            .then(() => {
                setShowCreateModal(false)
            })
            .catch((err) => {
                console.log(err)
                alert(err)
            })
    }

    const onUpdate = (data: Partial<PaymentMethod>) => {
        console.log('onUpdate', data)
        const final = {
            name: data.name,
            icon: selectedPayment!.icon,
            color: selectedPayment!.color,
            owned_by: selectedPayment!.owned_by,
            enabled: data.enabled,
            weight: data.weight,
        }
        updatePayment({ id: selectedPayment!.id, data: final })
            .unwrap()
            .then(() => {
                setShowEditModal(false)
            })
            .catch((err) => {
                console.log(err)
                alert(err)
            })
    }

    const onDelete = (data: PaymentMethod) => {
        console.log('onDelete', data)
        deletePayment(data.id)
            .unwrap()
            .then(() => {
                setShowEditModal(false)
            })
            .catch((err) => {
                console.log(err)
                alert('支付方式已被使用，無法刪除')
            })
    }

    return (
        <Box>
            <Box mb={2} display='flex' justifyContent='space-between'>
                <Button variant="outlined" onClick={handleCreatePayment} startIcon={<AddIcon />} >建立新的支付方式</Button>
                <IconButton onClick={() => setShowHelp(true)}><HelpIcon /></IconButton>
            </Box>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    已啟用的支付方式
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <List>
                            {enabledPayments.length ? enabledPayments.map((payment) => (
                                <ListItem key={payment.id} sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleEditPayment(payment)}>
                                        <ListItemText primary={payment.name} secondary={`權重: ${payment.weight}`} />
                                    </ListItemButton>
                                </ListItem>
                            )) : (<ListItem><Box fontStyle='italic'>先建立支付方式</Box></ListItem>)}
                        </List>
                    </Box>
                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    已停用的支付方式
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <List>
                            {disabledPayments.length ? disabledPayments.map((payment) => (
                                <ListItem key={payment.id} sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleEditPayment(payment)}>
                                        <ListItemText primary={payment.name} secondary={`權重: ${payment.weight}`} />
                                    </ListItemButton>
                                </ListItem>
                            )) : (<ListItem><Box fontStyle='italic'>{'這裡沒有東西 :)'}</Box></ListItem>)}
                        </List>
                    </Box>
                </AccordionDetails>
            </Accordion>

            

            {showCreateModal && <CreatePaymentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={onCreate} />}

            {showEditModal && selectedPayment && (<EditPaymentModal
                open={showEditModal}
                payment={selectedPayment}
                onClose={() => setShowEditModal(false)}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />)}

            <HelpMessageDialog open={showHelp} onClose={() => setShowHelp(false)}>
                <Typography variant="h6" color='common.white'>已啟用/停用的支付方式</Typography>
                <Typography variant="body1">已啟用的支付方式可以在建立支出記錄時選擇。已停用的支付方式會被隱藏。</Typography>
                <Typography variant="h6" color='common.white'>權重</Typography>
                <Typography variant="body1">權重數字越小，排列順序會越優先。</Typography>
                <Typography variant="h6" color='common.white'>刪除</Typography>
                <Typography variant="body1">已被使用的支付方式無法刪除。請停用來代替刪除。</Typography>
            </HelpMessageDialog>
        </Box>
    )
}