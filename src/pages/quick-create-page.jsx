import { createRef, useContext, useEffect, useRef, useState } from "react"
import { PocketBaseContext } from "../main"
import { PAYMENT_METHOD_COL, SPENT_RECORD_COL, SPENT_TYPE_COL, SPENT_RECORD_NAME_COL } from "../services/pocketbase"
// import { Button, Card, Modal, Form, InputGroup, Row, Col, Badge } from "react-bootstrap"
import Grid from '@mui/material/Unstable_Grid2'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Stack from "@mui/material/Stack"
import { Controller, useForm } from "react-hook-form"
import {
    Autocomplete, Box, Card, CardActionArea, CardContent, Chip, DialogActions,
    DialogContent, DialogTitle, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField,
    Typography 
} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import RecordTypeCard from "../components/record-type-card"


export default function QuickCreatePage() {
    const pb = useContext(PocketBaseContext)

    const [types, setTypes] = useState([])
    const [payments, setPayments] = useState([])
    const [selectedType, setSelectedType] = useState({})
    const [suggestedName, setSuggestedName] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    const { handleSubmit, reset, setValue, setFocus, control } = useForm({
        defaultValues: {
            name: '',
            payment: '',
        }
    })

    useEffect(() => {
        (async () => {
            let spentTypes = await pb.collection(SPENT_TYPE_COL).getFullList({
                sort: '+name',
            })
            setTypes(spentTypes)

            let paymentMethods = await pb.collection(PAYMENT_METHOD_COL).getFullList({
                sort: '+name',
            })
            setPayments(paymentMethods)
        })()
        
    }, [])

    useEffect(() => {
        (async () => {
            let names = await pb.collection(SPENT_RECORD_NAME_COL).getFullList({
                sort: '+name',
                filter: `type = '${selectedType.id}'`
            })
            setSuggestedName(names)
            console.log(names)
        })()
    }, [selectedType])

    useEffect(() => {
        reset()
        setFocus('price')

    }, [selectedType])

    const handleSelectType = (type) => {
        setShowModal(true)
        setSelectedType(type)
        console.log(type)
    }

    const onCreate = (data) => {
        console.log(data)
        let final = {
            ...data,
            type: selectedType.id,
            owned_by: pb.authStore.model.id,
        }
        console.log('final', final)
        pb.collection(SPENT_RECORD_COL).create(final).then(() => {
            setShowModal(false)
            setShowSnackbar(true)
            reset()
        })
        .catch((err) => {
            console.error(err)
            alert(err)
        })
    }

    return (
        <div>
            <h1>This is quick create page</h1>
            <div className="container text-center" style={{textAlign: 'center'}}>
                <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                {types.map((type) => (
                    <Grid key={type.id} xs={2} sm={2} md={3}>
                        <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)}>
                            {type.name}
                        </RecordTypeCard>
                    </Grid>
                    
                ))}
                
                </Grid>
                
            </div>

            <Dialog open={showModal}
                onClose={() => setShowModal(false)}
                fullWidth={true}
                maxWidth='sm'
                sx={{
                    '& .MuiDialog-container': {
                        'alignItems': 'flex-start'
                    }
                }}>
                <DialogTitle>
                    <Grid container spacing={1}>
                        <Grid xs='auto'>
                            <Chip label={selectedType.name} sx={{backgroundColor: selectedType.color}} />
                        </Grid>
                        <Grid>
                            Create record
                        </Grid>
                    </Grid>
                    
                    
                    <IconButton
                        onClick={() => setShowModal(false)}
                        sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,}}><CloseIcon /></IconButton>
                    
                </DialogTitle>
                <form onSubmit={handleSubmit(onCreate)}>
                
                <DialogContent>
                    <Box sx={{pt: 1}}>
                        <Grid container spacing={1}>
                            <Grid xs={6}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='Price'
                                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, }}
                                            fullWidth
                                            autoComplete="off"
                                            inputMode="numeric"
                                        />
                                    )}
                                    name='price'
                                    rules={{ required: true }}
                                    control={control}
                                />
                                {/* <TextFieldElement
                                    name='price'
                                    required
                                    label="Price"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    inputMode="numeric"
                                    inputRef={priceRef}
                                    autoComplete="off" /> */}
                            </Grid>
                            <Grid xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Payment</InputLabel>
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <Select
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                inputRef={ref}
                                                value={value}
                                                name={name}
                                                disabled={disabled}
                                                label="Payment"
                                                fullWidth
                                            >
                                                {payments.map((payment) => (
                                                    <MenuItem value={payment.id}>{payment.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                        name='payment'
                                        rules={{ required: true }}
                                        control={control}
                                    />
                                </FormControl>
                                {/* <FormControl fullWidth={true}>
                                    <SelectElement
                                        label="Payment" 
                                        name='payment' 
                                        required
                                        options={
                                            payments.map((payment) => {return {id: payment.id, label: payment.name}})
                                        } />
                                </FormControl> */}
                            </Grid>
                            <Grid xs={12}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <Autocomplete
                                            onBlur={onBlur}
                                            onChange={(e, v) => {console.log(v)}}
                                            onInputChange={(e, v) => {onChange(v)}}
                                            inputRef={ref}
                                            value={value}
                                            inputValue={value}
                                            name={name}
                                            disabled={disabled}
                                            freeSolo
                                            options={suggestedName.map((name) => {return {id: name.id, label: name.name}})}
                                            renderInput={(params) => <TextField {...params} label="Name" />}
                                            // getOptionLabel={(option) => option.name}
                                            // getOptionKey={(option) => option.id}
                                        />
                                    )}
                                    name='name'
                                    rules={{ required: true }}
                                    control={control}
                                />
                                {/* <AutocompleteElement
                                    name='name'
                                    required
                                    label="Name"
                                    fullWidth
                                    autocompleteProps={{
                                        freeSolo: true,
                                        renderInput:(params) => <TextField {...params} label="freeSolo" />
                                    }}
                                    options={suggestedName.map((name) => {return {id: name.id, label: name.name}})}
                                    /> */}
                            </Grid>
                            <Grid xs={12}>
                                {/* <TextareaAutosizeElement 
                                    name='description'
                                    label='Description'
                                    fullWidth
                                    rows={2} /> */}
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button type="submit" variant="contained">Create</Button>
                </DialogActions>
                </form>
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={showSnackbar}
                onClose={() => setShowSnackbar(false)}
                autoHideDuration={4000}
                message="Record Created"
                
                sx={{ bottom: { xs: 65, sm: 65 } }}
            />
        </div>
    )
}