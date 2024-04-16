import {
    Box, Button, Container, List, ListItem, Chip, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, Paper, Divider, Typography, ToggleButtonGroup,
    ToggleButton, FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails,
    InputAdornment,
    LinearProgress,
    CircularProgress
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { useContext, useEffect, useMemo, useState } from "react"
import { PocketBaseContext } from "../../context"
import { useForm, Controller } from "react-hook-form"
import { SwatchesPicker, ChromePicker } from 'react-color'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'

import RecordTypeCard from "../../components/record-type-card"
import { useAddTypeMutation, useDeleteTypeMutation, useGetTypesQuery, useUpdateTypeMutation } from "../../redux/typeSlice"
import HelpMessageDialog from "../../components/help-message-dialog"
import { useGetSessionQuery } from "../../redux/userSlice"

export default function ConfigTypePage() {
    const pb = useContext(PocketBaseContext)

    const { data: types, isLoading: isTypeLoading } = useGetTypesQuery()
    const [addType] = useAddTypeMutation()
    const [updateType] = useUpdateTypeMutation()
    const [deleteType] = useDeleteTypeMutation()

    const { data: session } = useGetSessionQuery()
    
    const enabledTypes = useMemo(() => types ? types.filter(x => x.enabled) : [], [types])
    const disabledTypes = useMemo(() => types ? types.filter(x => !x.enabled) : [], [types])
    
    const [selectedType, setSelectedType] = useState({})

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('edit')
    const [colorInputType, setColorInputType] = useState('palette')

    const [showMsgModal, setShowMsgModal] = useState({
        open: false,
        title: '',
        content: '',
    })

    const [showHelp, setShowHelp] = useState(false)

    const { handleSubmit, reset, setValue, setFocus, watch, control } = useForm({
        defaultValues: {
            weight: 100,
            budget: 0,
        }
    })
    const watchName = watch('name')
    const watchColor = watch('color')

    const handleSelectType = (type) => {
        setValue('name', type.name)
        setValue('color', type.color || '#fff')
        setValue('enabled', type.enabled)
        setValue('weight', type.weight)
        setValue('budget', type.budget)
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
            title: '刪除類別？',
            content: '如類別已被使用，則無法刪除'
        })
    }

    const onSave = (data) => {
        console.log(data)
        let final = {
            owned_by: selectedType.owned_by,
            name: data.name,
            color: data.color?.hex,
            enabled: data.enabled,
            weight: data.weight,
            budget: data.budget,
        }
        updateType({ id: selectedType.id, data: final })
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
            owned_by: session.user.id,
            name: data.name,
            color: data.color?.hex,
            enabled: true,
            weight: data.weight,
            budget: data.budget,
        }
        addType(final)
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
        deleteType(selectedType.id)
            .unwrap()
            .then(() => {
                setShowMsgModal({ open: false })
                setShowModal(false)
            })
            .catch((err) => {
                //alert(err)
                alert('類別已被使用，無法刪除')
                console.log(err)
            })
    }

    return (
        <Box>
            <Box mb={2} display='flex' justifyContent='space-between'>
                <Button variant="outlined" onClick={handleCreateType} startIcon={<AddIcon />}>建立新支出類別</Button>
                <IconButton onClick={() => setShowHelp(true)}><HelpIcon /></IconButton>
            </Box>
            
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    已啟用的類別
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{textAlign: 'center'}}>
                        {isTypeLoading ? (<CircularProgress />) : (
                        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {enabledTypes.length ? enabledTypes.map((type) => (
                                <Grid key={type.id} xs={2} sm={2} md={3}>
                                    <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)} weight={type.weight}>
                                        {type.name}
                                    </RecordTypeCard>
                                </Grid>
                                
                            )): (<Grid xs={12} fontStyle='italic' textAlign='center'>{'先建立新的類別'}</Grid>)}
                            
                        </Grid>)}
                    </Box>
                </AccordionDetails>
            </Accordion>
            {/* <Divider>Existing Types</Divider> */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    已停用的類別
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{textAlign: 'center'}}>
                        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {disabledTypes.length ? disabledTypes.map((type) => (
                                <Grid key={type.id} xs={2} sm={2} md={3}>
                                    <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)} weight={type.weight}>
                                        {type.name}
                                    </RecordTypeCard>
                                </Grid>
                                
                            )) : (<Grid xs={12} fontStyle='italic' textAlign='center'>{'這裡沒有東西 :)'}</Grid>)}
                            
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
            

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
                            {modalType === 'edit' && '編輯類別'}
                            {modalType === 'create' && '建立新類別'}
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
                        <Grid container spacing={1}>
                            <Grid xs={8}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='名稱'
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

                            <Grid xs={4}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='預算'
                                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                            inputProps={{ inputMode: 'decimal' }}
                                            fullWidth
                                            autoComplete="off"
                                            inputMode={'decimal'}
                                            type="number"
                                        />
                                    )}
                                    name='budget'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            
                            
                            <Grid xs={4}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='權重'
                                            inputProps={{ inputMode: 'numeric' }}
                                            fullWidth
                                            autoComplete="off"
                                            inputMode={'numeric'}
                                            type="number"
                                        />
                                    )}
                                    name='weight'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            {modalType === 'edit' && (
                                <Grid xs={8}>
                                    <Box display='flex' alignContent='center' height='100%' justifyContent='flex-end'>
                                    <Controller
                                        render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={value}
                                                        inputRef={ref}
                                                        name={name}
                                                        disabled={disabled}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                    />
                                                }
                                                label="已啟用"
                                            />
                                        )}
                                        name='enabled'
                                        control={control}
                                    />
                                    </Box>
                                </Grid>
                            )}
                            <Grid xs={12}>
                                <InputLabel>顏色</InputLabel>
                                <ToggleButtonGroup value={colorInputType} exclusive size="small" onChange={(e, v) => setColorInputType(v)}>
                                    <ToggleButton value='palette'>調色盤</ToggleButton>
                                    <ToggleButton value='custom'>自定義</ToggleButton>
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
                        </Grid>
                        <Grid container spacing={1} justifyContent='center'>
                            <Grid xs={12}>
                                <Divider><Typography variant="overline">預覽</Typography></Divider>
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
                    {modalType === 'edit' && (<Button variant="outlined" color='error' sx={{mr: 'auto'}} onClick={handleDeleteType}>刪除</Button>)}
                    <Button onClick={() => setShowModal(false)}>關閉</Button>
                    <Button type="submit" variant="contained">{modalType === 'edit' ? '儲存' : '建立'}</Button>
                </DialogActions>
                </form>
            </Dialog>

            <Dialog open={showMsgModal.open} onClose={() => setShowMsgModal({ open: false })}>
                <DialogTitle>{showMsgModal.title}</DialogTitle>
                {showMsgModal.content && (
                    <DialogContent>{showMsgModal.content}</DialogContent>
                )}
                <DialogActions>
                    <Button onClick={() => setShowMsgModal({ open: false })}>取消</Button>
                    <Button variant="contained" color='error' onClick={onDelete}>刪除</Button>
                </DialogActions>
            </Dialog>

            <HelpMessageDialog open={showHelp} onClose={() => setShowHelp(false)}>
                <Typography variant="h6" color='common.white'>已啟用/停用的類別</Typography>
                <Typography variant="body">已啟用的類別可在建立支出記錄時選擇。已停用的類別會被隱藏。</Typography>
                <Typography variant="h6" color='common.white'>權重</Typography>
                <Typography variant="body">權重數字越小，排列順序會越優先。</Typography>
                <Typography variant="h6" color='common.white'>刪除</Typography>
                <Typography variant="body">已被使用的類別無法刪除。請停用來代替刪除。</Typography>
            </HelpMessageDialog>
        </Box>
    )
}