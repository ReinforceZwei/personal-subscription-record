import { Box } from "@mui/material";
import ConfigContent from "./config-content";
import ConfigList from "./config-list";



export default function DesktopLayout() {
    return (
        <Box display="flex">
            <Box mb={2} mr={1} width="20%">
                <ConfigList />
            </Box>
            <Box width="80%" mt={2}>
                <ConfigContent />
            </Box>
        </Box>
    )
}