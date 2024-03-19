import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../main"
import { SPENT_RECORD_COL, SPENT_TYPE_COL } from "../services/pocketbase"
import Grid from '@mui/material/Unstable_Grid2'
import {
    Snackbar,
} from "@mui/material"
import RecordTypeCard from "../components/record-type-card"
import CreateRecordModal from "../components/create-record-modal"


export default function QuickCreatePage() {
    const pb = useContext(PocketBaseContext)

    const [types, setTypes] = useState([])
    const [selectedType, setSelectedType] = useState({})

    const [showModal, setShowModal] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    useEffect(() => {
        (async () => {
            let spentTypes = await pb.collection(SPENT_TYPE_COL).getFullList({
                sort: '+name',
            })
            setTypes(spentTypes)
        })()
        
    }, [])

    const handleSelectType = (type) => {
        setShowModal(true)
        setSelectedType(type)
        console.log(type)
    }

    const handleCloseModal = () => {
        setShowModal(false)
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

            { showModal && (
                <CreateRecordModal
                    open={showModal}
                    onClose={() => handleCloseModal()}
                    selectedType={selectedType}
                    onCreate={onCreate}
                />
            )}
            
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