
import { useContext, useEffect, useMemo } from 'react'
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { PocketBaseContext, ThemeContext } from '../context'
import HeaderLayout from '../layouts/header-layout'
import { Container, createTheme, PaletteMode, ThemeProvider, useMediaQuery } from '@mui/material'
import FooterLayout from '../layouts/footer-layout'
import { useGetUserSettingsQuery } from "../redux/userSettingsSlice";
import { ColorMode, themeOptions } from '../themes'

export default function Root() {
    const pb = useContext(PocketBaseContext)
    const {colorMode, setColorMode} = useContext(ThemeContext)

    const { data: userSettings } = useGetUserSettingsQuery(undefined, { skip: !pb?.authStore?.isValid })
    useEffect(() => {
        if (userSettings && userSettings.color_mode != colorMode) {
            setColorMode(userSettings.color_mode as ColorMode)
        }
    }, [userSettings, setColorMode])
    
    if (!pb?.authStore?.isValid) {
        return (<Navigate to='/login' />)
    }
    return (
        <div>
            <HeaderLayout />
            <Container>
                <Outlet />
            </Container>
            <FooterLayout />
        </div>
    )
}