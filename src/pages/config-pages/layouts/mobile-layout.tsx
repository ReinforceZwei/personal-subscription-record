import { AppBar, Box, Button, Icon, Typography } from "@mui/material";
import ConfigList from "./config-list";
import ConfigContent from "./config-content";
import { useLocation } from "react-router-dom";
import { ConfigPageTitles } from "./config-list";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function MobileLayout() {
    const { pathname } = useLocation()

    const isIndex = pathname === '/config'
    const pageName = pathname.split('/').pop() as keyof typeof ConfigPageTitles
    const title = ConfigPageTitles[pageName]
    
    return (
        <Box display="flex">
            {isIndex && <ConfigList />}
            {!isIndex && (
                <Box width="100%">
                    <Button startIcon={<ArrowBackIosIcon />} onClick={() => window.history.back()}>Back</Button>
                    {/* <Typography variant="h6" component="div">
                        {title}
                    </Typography> */}
                    <Box mt={2}>
                        <ConfigContent />
                    </Box>
                </Box>
            )}
        </Box>
    )
}