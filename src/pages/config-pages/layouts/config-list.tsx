import { Box, Button, ButtonGroup, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ConfigPages } from "../../config-page";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import ConfirmDeleteDialog from "../../../components/confirm-delete-dialog";

export const ConfigPageTitles: { [key in 'type' | 'payment' | 'preference' | 'budget' | 'preset' | 'about']: string } = {
    'type': '支出類別',
    'payment': '支付方式',
    'preference': '喜好',
    'budget': '預算',
    'preset': '預設範本',
    'about': '關於'
}

export default function ConfigList() {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const [showConfirmLogout, setShowConfirmLogout] = useState(false)
    
    const isIndex = pathname === '/config'
    const pageName = pathname.split('/').pop()

    const handleConfirmLogout = () => {
        setShowConfirmLogout(true)
    }

    const logout = () => {
        navigate('/logout')
    }

    return (
        <Box width="100%">
        <List subheader={<ListSubheader>設定</ListSubheader>}>
            <ListItem disablePadding>
                <ListItemButton component={NavLink} to='preference' selected={pageName === 'preference'}>喜好</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={NavLink} to='budget' selected={pageName === 'budget'}>預算</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={NavLink} to='type' selected={pageName === 'type'}>支出類別</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={NavLink} to='payment' selected={pageName === 'payment'}>支付方式</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={NavLink} to='preset' selected={pageName === 'preset'}>預設範本</ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={NavLink} to='about' selected={pageName === 'about'}>關於</ListItemButton>
            </ListItem>
        </List>
        <Button variant="outlined" fullWidth onClick={() => handleConfirmLogout()}>登出</Button>
        {showConfirmLogout && 
            <ConfirmDeleteDialog
                open={showConfirmLogout}
                title="確定要登出嗎？"
                confirmActionText="登出"
                cancelActionText="取消"
                onConfirm={() => logout()}
                onClose={() => setShowConfirmLogout(false)}
            />
        }
        </Box>
    )
}
