import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton,
    ListItemButton
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { useContext, useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { addPayment, deletePayment, fetchPayments, selectPayments, updatePayment } from "../../redux/paymentSlice"
import CreatePaymentModal from "../../components/create-payment-modal"
import EditPaymentModal from "../../components/edit-payment-modal"
import { PocketBaseContext } from "../../main"

export default function ConfigPaymentPage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const payments = useSelector(selectPayments)
    const [selectedPayment, setSelectedPayment] = useState({})
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

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
            <Button variant="outlined" onClick={handleCreatePayment}>Create New Payment</Button>
            <Divider>Existing Payment Methods</Divider>

            <Box>
                <List>
                    {payments.map((payment) => (
                        <ListItem key={payment.id}>
                            <ListItemButton onClick={() => handleEditPayment(payment)}>{payment.name}</ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {showCreateModal && <CreatePaymentModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={onCreate} />}

            {showEditModal && (<EditPaymentModal
                open={showEditModal}
                payment={selectedPayment}
                onClose={() => setShowEditModal(false)}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />)}
        </Box>
    )
}