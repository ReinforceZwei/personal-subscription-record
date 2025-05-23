import { useContext, useEffect, useMemo, useState } from "react"
import { PocketBaseContext } from "../context"
import Grid from '@mui/material/Grid2'
import {
    Snackbar, Box, Typography, ListItemButton, ListItemText, Paper, Divider, Fab
} from "@mui/material"
import { Link } from "react-router-dom"
import RecordTypeCard from "../components/RecordType/record-type-card"
import CreateRecordModal from "../components/RecordModal/create-record-modal"
import { useDispatch, useSelector } from "react-redux"
import { useAddRecordMutation } from "../redux/recordSlice"
import { useGetTypesQuery } from '../redux/typeSlice'
import { useGetPresetsQuery } from "../redux/presetSlice"
import RecordTypeChip from "../components/RecordType/record-type-chip"
import _ from 'lodash-es'
import { useGetPaymentsQuery } from "../redux/paymentSlice"
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CurrencyCalculatorModal from "../components/CurrencyCalculator/currency-calculator-modal"
import { SpentPreset, SpentRecord, SpentType } from "../services/pocketbase"


export default function QuickCreatePage() {
    const pb = useContext(PocketBaseContext)

    const dispatch = useDispatch()

    const { data: types, isLoading: isTypeLoading } = useGetTypesQuery()
    const enabledTypes = useMemo(() => types ? types.filter(x => x.enabled) : [], [types])
    const typesTable = useMemo(() => types ? _.keyBy(types, 'id') : {}, [types])

    const { data: payments } = useGetPaymentsQuery()
    const paymentsTable = useMemo(() => payments ? _.keyBy(payments, 'id') : {}, [payments])

    const { data: presets } = useGetPresetsQuery()

    const [selectedType, setSelectedType] = useState<SpentType | null>(null)
    const [selectedPreset, setSelectedPreset] = useState<SpentPreset | null>(null)

    const [showModal, setShowModal] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [showCalc, setShowCalc] = useState(false)

    const handleSelectType = (type: SpentType) => {
        setShowModal(true)
        setSelectedType(type)
        setSelectedPreset(null)
    }

    const handleSelectPreset = (preset: SpentPreset) => {
        setSelectedPreset(preset)
        setSelectedType(typesTable[preset.type!])
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const [addRecord, { isLoading: isAdding }] = useAddRecordMutation()
    const onCreate = async (data: Partial<SpentRecord>) => {
        let final = {
            ...data,
            type: selectedType?.id,
            owned_by: pb?.authStore.model?.id,
        }
        try {
            await addRecord(final).unwrap()
            setShowModal(false)
            setShowSnackbar(true)
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Box>
                { presets && (
                    <Grid container columnSpacing={3} columns={{ xs: 6, sm: 12 }}>
                        { presets.map((preset) => (
                            <Grid key={preset.id} size={6}>
                                <ListItemButton sx={{ height: '100%' }} onClick={() => handleSelectPreset(preset)}>
                                    <RecordTypeChip label={typesTable[preset.type!]?.name} bg={typesTable[preset.type!]?.color} sx={{mr: 1}} />
                                    <ListItemText primary={preset.name} secondary={paymentsTable[preset.payment!]?.name} />
                                    { !!preset.price && (<span>${preset.price}</span>) }
                                </ListItemButton>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            {/* <Typography variant="h5">選擇一個類別來記錄支出</Typography> */}
            <Divider>選擇類別</Divider>
            <Box sx={{textAlign: 'center', mt: 2}}>
                <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                {enabledTypes.length ? enabledTypes.map((type) => (
                    <Grid
                        key={type.id}
                        size={{
                            xs: 2,
                            sm: 2,
                            md: 3
                        }}>
                        <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)}>
                            {type.name}
                        </RecordTypeCard>
                    </Grid>
                    
                )) : (<Grid mt={12} size={12}><Link to='/config/type'>建立支出類別</Link>{'來開始'}</Grid>)}
                
                </Grid>
                
            </Box>
            { showModal && (
                <CreateRecordModal
                    open={showModal}
                    onClose={() => handleCloseModal()}
                    selectedType={selectedType!}
                    preset={selectedPreset!}
                    onCreate={onCreate}
                />
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={showSnackbar}
                onClose={() => setShowSnackbar(false)}
                autoHideDuration={4000}
                message="記錄已建立"
                
                sx={{
                    bottom: {
                        xs: 'calc(65px + env(safe-area-inset-bottom))',
                        sm: 'calc(65px + env(safe-area-inset-bottom))',
                    }
                }}
            />
            <Box sx={{position: 'fixed', left: 10, bottom: 'calc(65px + env(safe-area-inset-bottom))'}}>
                <Fab size="small" color='secondary' onClick={() => setShowCalc(true)}>
                    <CurrencyExchangeIcon />
                </Fab>
            </Box>
            { showCalc && <CurrencyCalculatorModal onClose={() => setShowCalc(false)} />}
        </Box>
    );
}