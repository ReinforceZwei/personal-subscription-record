import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
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
import { useContext, useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { addPayment, deletePayment, fetchPayments, selectPayments, updatePayment } from "../../redux/paymentSlice"
import CreatePaymentModal from "../../components/create-payment-modal"
import EditPaymentModal from "../../components/edit-payment-modal"
import { PocketBaseContext } from "../../main"
import HelpMessageDialog from "../../components/help-message-dialog"

export default function ConfigPaymentPage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const payments = useSelector(selectPayments)
    const enabledPayments = payments.filter(x => x.enabled)
    const disabledPayments = payments.filter(x => !x.enabled)
    const [selectedPayment, setSelectedPayment] = useState({})
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    useEffect(() => {
        dispatch(fetchPayments())

    }, [])

    const handleCreatePayment = () => {
        setShowCreateModal(true)
    }

    const handleEditPayment = (payment) => {
        setSelectedPayment(payment)
        setShowEditModal(true)
    }

    const onCreate = (data) => {
        console.log('onCreate', data)
        const final = {
            name: data.name,
            icon: '',
            color: '',
            owned_by: pb.authStore.model.id,
            enabled: true,
            weight: data.weight,
        }
        dispatch(addPayment({ data: final }))
            .unwrap()
            .then(() => {
                setShowCreateModal(false)
            })
            .catch((err) => {
                console.log(err)
                alert(err)
            })
    }

    const onUpdate = (data) => {
        console.log('onUpdate', data)
        const final = {
            name: data.name,
            icon: selectedPayment.icon,
            color: selectedPayment.color,
            owned_by: selectedPayment.owned_by,
            enabled: data.enabled,
            weight: data.weight,
        }
        dispatch(updatePayment({ id: selectedPayment.id, data: final }))
            .unwrap()
            .then(() => {
                setShowEditModal(false)
            })
            .catch((err) => {
                console.log(err)
                alert(err)
            })
    }

    const onDelete = (data) => {
        console.log('onDelete', data)
        dispatch(deletePayment({ id: data.id }))
            .unwrap()
            .then(() => {
                setShowEditModal(false)
            })
            .catch((err) => {
                console.log(err)
                alert('Cannot delete payment method because it is in use.')
            })
    }

    return (
        <Box>
            <Box mb={2} display='flex' justifyContent='space-between'>
                <Button variant="outlined" onClick={handleCreatePayment} startIcon={<AddIcon />} >Create New Payment</Button>
                <IconButton onClick={() => setShowHelp(true)}><HelpIcon /></IconButton>
            </Box>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Active Payment Methods
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <List>
                            {enabledPayments.length ? enabledPayments.map((payment) => (
                                <ListItem key={payment.id} sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleEditPayment(payment)}>
                                        <ListItemText primary={payment.name} secondary={`Weight: ${payment.weight}`} />
                                    </ListItemButton>
                                </ListItem>
                            )) : (<ListItem><Box fontStyle='italic'>Go create new payment method</Box></ListItem>)}
                        </List>
                    </Box>
                </AccordionDetails>
            </Accordion>
            
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Disabled Payment Methods
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <List>
                            {disabledPayments.length ? disabledPayments.map((payment) => (
                                <ListItem key={payment.id} sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleEditPayment(payment)}>
                                        <ListItemText primary={payment.name} secondary={`Weight: ${payment.weight}`} />
                                    </ListItemButton>
                                </ListItem>
                            )) : (<ListItem><Box fontStyle='italic'>{'Nothing here :)'}</Box></ListItem>)}
                        </List>
                    </Box>
                </AccordionDetails>
            </Accordion>

            

            {showCreateModal && <CreatePaymentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={onCreate} />}

            {showEditModal && (<EditPaymentModal
                open={showEditModal}
                payment={selectedPayment}
                onClose={() => setShowEditModal(false)}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />)}

            <HelpMessageDialog open={showHelp} onClose={() => setShowHelp(false)}>
                <Typography variant="h6">Active/Disabled Payment</Typography>
                <Typography variant="body">Active Payment is visible in create record. Disabled Payment is hidden in create record.</Typography>
                <Typography variant="h6">Weight</Typography>
                <Typography variant="body">Smaller weight value will have higher position.</Typography>
                <Typography variant="h6">Delete</Typography>
                <Typography variant="body">The payment cannot be deleted if used. Disable the payment instead.</Typography>
            </HelpMessageDialog>
        </Box>
    )
}