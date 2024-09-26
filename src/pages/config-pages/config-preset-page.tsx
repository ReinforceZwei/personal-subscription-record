import { useContext, useEffect, useMemo, useState } from "react"
import Grid from '@mui/material/Unstable_Grid2'
import { Box, Button, IconButton, ListItemButton, ListItemText, Typography } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help'
import AddIcon from '@mui/icons-material/Add'
import _ from 'lodash-es'
import RecordTypeChip from "../../components/record-type-chip"
import { useAddPresetMutation, useDeletePresetMutation, useGetPresetsQuery, useUpdatePresetMutation } from "../../redux/presetSlice"
import { useGetTypesQuery } from '../../redux/typeSlice'
import { useGetPaymentsQuery } from "../../redux/paymentSlice"
import EditPresetModal from "../../components/edit-preset-modal";
import ConfirmDeleteDialog from "../../components/confirm-delete-dialog";
import HelpMessageDialog from "../../components/help-message-dialog"
import { SpentPreset } from "../../services/pocketbase";

export default function ConfigPresetPage() {
    const { data: presets } = useGetPresetsQuery()
    const { data: types, isLoading: isTypeLoading } = useGetTypesQuery()
    const typesTable = useMemo(() => types ? _.keyBy(types, 'id') : {}, [types])

    const { data: payments } = useGetPaymentsQuery()
    const paymentsTable = useMemo(() => payments ? _.keyBy(payments, 'id') : {}, [payments])

    const [editModal, setEditModal] = useState<{
        mode: 'edit' | 'create',
        open: boolean,
        preset: SpentPreset | null
    }>({
        mode: 'edit',
        open: false,
        preset: null,
    })
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    const [addPreset] = useAddPresetMutation()
    const [updatePreset] = useUpdatePresetMutation()
    const [deletePreset] = useDeletePresetMutation()

    const handleCreate = (data: Partial<SpentPreset>) => {
        console.log(data)
        addPreset(data)
            .unwrap()
            .then(() => {
                setEditModal({...editModal, open: false})
            })
            .catch((err) => {
                console.error(err)
                alert(err)
            })
    }

    const handleUpdate = (data: Partial<SpentPreset>) => {
        console.log(data)
        console.log(editModal)
        updatePreset({ id: editModal.preset!.id, data })
            .unwrap()
            .then(() => {
                setEditModal({...editModal, open: false})
            })
            .catch((err) => {
                console.error(err)
                alert(err)
            })
    }

    const handleDelete = (data: SpentPreset) => {
        setConfirmDelete(true)
    }

    const handleConfirmDelete = () => {
        deletePreset(editModal.preset!.id)
            .unwrap()
            .then(() => {
                setEditModal({...editModal, open: false})
                setConfirmDelete(false)
            })
            .catch((err) => {
                console.error(err)
                alert(err)
            })
    }

    return (
        <Box>
            <Box mb={2} display='flex' justifyContent='space-between'>
                <Button variant="outlined"  startIcon={<AddIcon />} onClick={() => setEditModal({...editModal, open: true, preset: null, mode: 'create'})}>建立預設範本</Button>
                <IconButton onClick={() => setShowHelp(true)} ><HelpIcon /></IconButton>
            </Box>

            <Box>
                { (presets && presets.length) ? (
                    <Grid container columnSpacing={3} columns={{ xs: 6, sm: 12 }}>
                        { presets.map((preset) => (
                            <Grid xs={6} key={preset.id}>
                                <ListItemButton sx={{ height: '100%' }} onClick={() => setEditModal({...editModal, open: true, preset, mode: 'edit'})} >
                                    <RecordTypeChip label={typesTable[preset.type!]?.name} bg={typesTable[preset.type!]?.color} sx={{mr: 1}} />
                                    <ListItemText primary={preset.name} secondary={'權重: ' + preset.weight} />
                                    <Box mr={1}>{paymentsTable[preset.payment!]?.name}</Box>
                                    { !!preset.price && (<span>${preset.price}</span>) }
                                </ListItemButton>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box textAlign='center' fontStyle='italic'>
                        沒有預設範本
                    </Box>
                )}
            </Box>

            { editModal.open && 
                <EditPresetModal
                    open={editModal.open}
                    mode={editModal.mode}
                    preset={editModal.preset!}
                    types={types!}
                    payments={payments!}
                    onClose={() => setEditModal({...editModal, open: false})}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            }

            { confirmDelete && 
                <ConfirmDeleteDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={() => handleConfirmDelete()} />
            }

            <HelpMessageDialog open={showHelp} onClose={() => setShowHelp(false)}>
                <Typography variant="h6" color='common.white'>預設範本</Typography>
                <Typography variant="body1">預設範本會顯示在建立頁面，允許你預先填入部分資料，減少建立記錄時的操作。</Typography>
                <Typography variant="h6" color='common.white'>權重</Typography>
                <Typography variant="body1">權重數字越小，排列順序會越優先。</Typography>
            </HelpMessageDialog>
        </Box>
    )
}