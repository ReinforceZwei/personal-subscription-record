import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom"
import RestoreIcon from '@mui/icons-material/Restore'
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { useEffect, useState } from "react";


export default function FooterLayout() {
    const { pathname } = useLocation()
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (pathname.startsWith('/spentRecord')) {
            setValue('records')
        } else if (pathname.startsWith('/quickCreate')) {
            setValue('create')
        } else if (pathname.startsWith('/config')) {
            setValue('settings')
        } else if (pathname.startsWith('/subscriptionRecord')) {
            setValue('subscriptionRecord')
        }
    }, [pathname])
   
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, pb: 'env(safe-area-inset-bottom, 20px)' }} elevation={3}>
            <BottomNavigation showLabels value={value} onChange={(e, v) => setValue(v)} sx={{backgroundColor: 'initial'}}>
                <BottomNavigationAction 
                    label='Records'
                    value='records'
                    icon={<LocalMallIcon />}
                    LinkComponent={NavLink}
                    to='/spentRecord' />
                
                <BottomNavigationAction 
                    label='Subscription'
                    value='subscriptionRecord'
                    icon={<CreditScoreIcon />}
                    LinkComponent={NavLink}
                    to='/subscriptionRecord' />
                
                <BottomNavigationAction 
                    label='Create'
                    value='create'
                    icon={<AddIcon />}
                    LinkComponent={NavLink}
                    to='/quickCreate' />
                
                <BottomNavigationAction 
                    label='Settings'
                    value='settings'
                    icon={<TuneIcon />}
                    LinkComponent={NavLink}
                    to='/config' />
            </BottomNavigation>
        </Paper>
    )
}