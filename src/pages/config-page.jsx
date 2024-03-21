import { Autocomplete, Box, Tab, Tabs, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { Outlet, NavLink, useLocation } from "react-router-dom"

export default function ConfigPage() {
    const { pathname } = useLocation()
    const [value, setValue] = useState('type')

    useEffect(() => {
        if (pathname.includes('/type')) {
            setValue('type')
        } else if (pathname.includes('/payment')) {
            setValue('payment')
        } else if (pathname.includes('/preference')) {
            setValue('preference')
        }
    }, [value, pathname])

    return (
        <div>
            <Box mb={2}>
                <Tabs value={value} onChange={(e, v) => setValue(v)} role='navigation' variant="scrollable" scrollButtons="auto">
                    <Tab LinkComponent={NavLink} to='preference' value='preference' label='Preference' />
                    <Tab LinkComponent={NavLink} to='type' value='type' label='Type' />
                    <Tab LinkComponent={NavLink} to='payment' value='payment' label='Payment' />
                </Tabs>
            </Box>
            <div>
                <Outlet />
            </div>
        </div>
    )
}