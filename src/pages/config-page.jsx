import { Autocomplete, Tab, Tabs, TextField } from "@mui/material"
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
        }
    }, [value, pathname])

    return (
        <div>
            <h1>This is config page</h1>
            <Tabs value={value} onChange={(e, v) => setValue(v)} role='navigation'>
                <Tab LinkComponent={NavLink} to='type' value='type' label='Type' />
                <Tab LinkComponent={NavLink} to='payment' value='payment' label='Payment' />
            </Tabs>
            <div>
                <Outlet />
            </div>
        </div>
    )
}