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
        } else if (pathname.includes('/budget')) {
            setValue('budget')
        } else if (pathname.includes('/preset')) {
            setValue('preset')
        } else if (pathname.includes('/about')) {
            setValue('about')
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
                    <Tab LinkComponent={NavLink} to='preference' value='preference' label='喜好' />
                    <Tab LinkComponent={NavLink} to='budget' value='budget' label='預算' />
                    <Tab LinkComponent={NavLink} to='type' value='type' label='支出類別' />
                    <Tab LinkComponent={NavLink} to='payment' value='payment' label='支付方式' />
                    <Tab LinkComponent={NavLink} to='preset' value='preset' label='預設範本' />
                    <Tab LinkComponent={NavLink} to='about' value='about' label='關於' />
                </Tabs>
            </Box>
            <div>
                <Outlet />
            </div>
        </div>
    )
}