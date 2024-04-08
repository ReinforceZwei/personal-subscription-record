import { Box, LinearProgress } from "@mui/material"
import { useSelector } from "react-redux"
import { selectLinearProgress } from "../redux/uiSlice"

export default function HeaderLayout() {
    const showLinearProgress = useSelector(selectLinearProgress)
    return (
        <Box pb='4px'>
            <Box position='absolute' top={0} left={0} width='100%'>
                { showLinearProgress && <LinearProgress /> }
            </Box>
        </Box>
        
    )
}