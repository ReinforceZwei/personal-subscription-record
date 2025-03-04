import { Box, List, ListItem, ListItemButton, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"
import { selectLastConfigPage, setLastConfigPage } from "../redux/routingSlice"
import { useAppDispatch } from "../hooks"
import MobileLayout from "./config-pages/layouts/mobile-layout"
import DesktopLayout from "./config-pages/layouts/desktop-layout"

export type ConfigPages = 'type' | 'payment' | 'preference' | 'budget' | 'preset' | 'about'

export default function ConfigPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isMobileScreen = useMediaQuery('(max-width: 600px)')

    const { pathname } = useLocation()
    const lastPage = useSelector(selectLastConfigPage) as ConfigPages
    const [value, setValue] = useState<ConfigPages>(lastPage || (isMobileScreen ? '' : 'preference'))
    

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
            //navigate(lastPage)
        }
    }, [value, pathname, lastPage])

    useEffect(() => {
        if (!isMobileScreen) {
            navigate(`/config/${value}`)
        }
    }, [value, isMobileScreen])

    useEffect(() => {
        dispatch(setLastConfigPage(value))
    }, [value])

    if (isMobileScreen) {
        return <MobileLayout />
    }
    return <DesktopLayout />
}