import {
    Box, Button, IconButton,Typography,
    Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material"
import Grid from '@mui/material/Grid2'
import { useMemo, useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'

import RecordTypeCard from "../../components/RecordType/record-type-card"
import { useGetTypesQuery } from "../../redux/typeSlice"
import HelpMessageDialog from "../../components/help-message-dialog"
import RecordTypeDialog from "../../components/RecordTypeDialog/record-type-dialog"
import { SpentType } from "../../services/pocketbase"

export default function ConfigTypePage() {
    const { data: types } = useGetTypesQuery()
    
    const enabledTypes = useMemo(() => types ? types.filter(x => x.enabled) : [], [types])
    const disabledTypes = useMemo(() => types ? types.filter(x => !x.enabled) : [], [types])
    
    const [selectedType, setSelectedType] = useState<SpentType | null>(null)

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<'edit' | 'create'>('edit')

    const [showMsgModal, setShowMsgModal] = useState({
        open: false,
        title: '',
        content: '',
    })

    const [showHelp, setShowHelp] = useState(false)

    const handleSelectType = (type: SpentType) => {
        setSelectedType(type)
        setModalType('edit')
        setShowModal(true)
    }

    const handleCreateType = () => {
        setSelectedType(null)
        setModalType('create')
        setShowModal(true)
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
                        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {enabledTypes.length ? enabledTypes.map((type) => (
                                <Grid
                                    key={type.id}
                                    size={{
                                        xs: 2,
                                        sm: 2,
                                        md: 3
                                    }}>
                                    <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)} weight={type.weight}>
                                        {type.name}
                                    </RecordTypeCard>
                                </Grid>
                                
                            )): (<Grid fontStyle='italic' textAlign='center' size={12}>{'先建立新的類別'}</Grid>)}
                            
                        </Grid>
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
                                <Grid
                                    key={type.id}
                                    size={{
                                        xs: 2,
                                        sm: 2,
                                        md: 3
                                    }}>
                                    <RecordTypeCard bg={type.color} onClick={() => handleSelectType(type)} weight={type.weight}>
                                        {type.name}
                                    </RecordTypeCard>
                                </Grid>
                                
                            )) : (<Grid fontStyle='italic' textAlign='center' size={12}>{'這裡沒有東西 :)'}</Grid>)}
                            
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
            { showModal && <RecordTypeDialog
                open={showModal}
                onClose={() => setShowModal(false)}
                modalType={modalType}
                spentType={selectedType || undefined}
            />}
            <HelpMessageDialog open={showHelp} onClose={() => setShowHelp(false)}>
                <Typography variant="h6" color='common.white'>已啟用/停用的類別</Typography>
                <Typography variant="body1">已啟用的類別可在建立支出記錄時選擇。已停用的類別會被隱藏。</Typography>
                <Typography variant="h6" color='common.white'>權重</Typography>
                <Typography variant="body1">權重數字越小，排列順序會越優先。</Typography>
                <Typography variant="h6" color='common.white'>刪除</Typography>
                <Typography variant="body1">已被使用的類別無法刪除。請停用來代替刪除。</Typography>
            </HelpMessageDialog>
        </Box>
    );
}