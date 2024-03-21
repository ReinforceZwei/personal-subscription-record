import { Box, Button, Container, List, ListItem, Chip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, InputLabel, Paper, Divider, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../../main"
import { SPENT_TYPE_COL } from "../../services/pocketbase"
import { useForm, Controller } from "react-hook-form"
import { SwatchesPicker, ChromePicker } from 'react-color'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector, useDispatch } from 'react-redux'

import RecordTypeCard from "../../components/record-type-card"
import { addType, deleteType, fetchTypes, selectTypes, updateType } from "../../redux/typeSlice"

export default function ConfigTypePage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()

    const types = useSelector(selectTypes)
    //const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState({})

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('edit')
    const [colorInputType, setColorInputType] = useState('palette')

    const [showMsgModal, setShowMsgModal] = useState({
        open: false,
        title: '',
        content: '',
    })

    const { handleSubmit, reset, setValue, setFocus, watch, control } = useForm()
    const watchName = watch('name')
    const watchColor = watch('color')

    useEffect(() => {
        dispatch(fetchTypes())

    }, [])

    const handleSelectType = (type) => {
        setValue('name', type.name)
        setValue('color', type.color || '#fff')
        setSelectedType(type)
        setModalType('edit')
        setShowModal(true)
    }

    const handleCreateType = () => {
        reset()
        setSelectedType({
            name: '',
            color: '',
        })
        setModalType('create')
        setShowModal(true)
        setTimeout(() => {
            setFocus('name')
        }, 1)
    }

    const handleDeleteType = () => {
        setShowMsgModal({
            open: true,
            title: 'Delete type?',
            content: 'The type cannot be deleted if the type is in use.'
        })
    }

    const onSave = (data) => {
        console.log(data)
        let final = {
            owned_by: selectedType.owned_by,
            icon: selectedType.icon,
            name: data.name,
            color: data.color.hex,
        }
        dispatch(updateType({ id: selectedType.id, data: final }))
            .unwrap()
            .then(() => {
                setShowModal(false)
            })
            .catch((err) => {
                alert(err)
                console.log(err)
            })
    }

    const onCreate = (data) => {
        console.log(data)
        let final = {
            owned_by: pb.authStore.model.id,
            icon: '',
            name: data.name,
            color: data.color.hex,
        }
        dispatch(addType({ data: final }))
            .unwrap()
            .then(() => {
                setShowModal(false)
            })
            .catch((err) => {
                alert(err)
                console.log(err)
            })
    }

    const onDelete = () => {
        dispatch(deleteType({ id: selectedType.id }))
            .unwrap()
            .then(() => {
                setShowMsgModal({ open: false })
                setShowModal(false)
            })
            .catch((err) => {
                //alert(err)
                alert('Type is in use and cannot deleted.')
                console.log(err)
            })
    }

    return (
        <Box>
            <Button variant="outlined" onClick={handleCreateType}>Create New Type</Button>
            <Divider>Existing Types</Divider>
            <Box sx={{textAlign: 'center'}}>
                <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {types.map((type) => (
                        <Grid key={type.id} xs={2} sm={2} md={3}>
                            <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)}>
                                {type.name}
                            </RecordTypeCard>
                        </Grid>
                        
                    ))}
                    
                </Grid>
            </Box>

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
                        <Grid>
                            {modalType === 'edit' && 'Edit Type'}
                            {modalType === 'create' && 'Create Type'}
                        </Grid>
                    </Grid>
                    
                    
                    <IconButton
                        onClick={() => setShowModal(false)}
                        sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,}}><CloseIcon /></IconButton>
                    
                </DialogTitle>
                <form onSubmit={modalType === 'edit' ? handleSubmit(onSave) : handleSubmit(onCreate)}>
                
                <DialogContent>
                    <Box sx={{pt: 1}}>
                        <Grid container spacing={1} justifyContent='center'>
                            <Grid xs={12}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='Name'
                                            fullWidth
                                            autoComplete="off"
                                            autoFocus
                                        />
                                    )}
                                    name='name'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <InputLabel>Color</InputLabel>
                                <ToggleButtonGroup value={colorInputType} exclusive size="small" onChange={(e, v) => setColorInputType(v)}>
                                    <ToggleButton value='palette'>Palette</ToggleButton>
                                    <ToggleButton value='custom'>Custom</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid xs={12}>
                                {colorInputType === 'palette' && (
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <SwatchesPicker color={value} onChange={onChange} width='auto' />
                                        )}
                                        name='color'
                                        control={control}
                                    />
                                )}
                                {colorInputType === 'custom' && (
                                    <Box display='flex' justifyContent='center' sx={{textAlign: 'center'}}>
                                        <Controller
                                            render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                                <ChromePicker color={value} onChange={onChange} disableAlpha />
                                            )}
                                            name='color'
                                            control={control}
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid xs={12}>
                                <Divider><Typography variant="overline">Preview</Typography></Divider>
                            </Grid>
                            <Grid xs={6}>
                            
                                <Box sx={{textAlign: 'center'}}>
                                    <RecordTypeCard bg={watchColor?.hex || selectedType.color} colorTransition={200}>
                                        {watchName || selectedType.name || '---'}
                                    </RecordTypeCard>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {modalType === 'edit' && (<Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={handleDeleteType}>Delete</Button>)}
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button type="submit" variant="contained">{modalType === 'edit' ? 'Save' : 'Create'}</Button>
                </DialogActions>
                </form>
            </Dialog>

            <Dialog open={showMsgModal.open} onClose={() => setShowMsgModal({ open: false })}>
                <DialogTitle>{showMsgModal.title}</DialogTitle>
                {showMsgModal.content && (
                    <DialogContent>{showMsgModal.content}</DialogContent>
                )}
                <DialogActions>
                    <Button onClick={() => setShowMsgModal({ open: false })}>Cancel</Button>
                    <Button variant="contained" color='error' onClick={onDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}