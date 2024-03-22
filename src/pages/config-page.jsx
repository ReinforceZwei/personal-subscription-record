import { Autocomplete, Box, Tab, Tabs, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"
import { selectLastConfigPage, setLastConfigPage } from "../redux/routingSlice"

export default function ConfigPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { pathname } = useLocation()
    const lastPage = useSelector(selectLastConfigPage)
    const [value, setValue] = useState(lastPage || 'preference')
    

    useEffect(() => {
        if (pathname.includes('/type')) {
            setValue('type')
        } else if (pathname.includes('/payment')) {
            setValue('payment')
        } else if (pathname.includes('/preference')) {
            setValue('preference')
        } else {
            navigate(lastPage)
        }
    }, [value, pathname, lastPage])

    useEffect(() => {
        dispatch(setLastConfigPage(value))
    }, [value])

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