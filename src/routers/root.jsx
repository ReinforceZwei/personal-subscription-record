
import { useEffect, useState, useContext } from 'react'
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { PocketBaseContext } from '../main'
import HeaderLayout from '../layouts/header-layout'
import Stack from '@mui/material/Stack'
import { Container, CssBaseline } from '@mui/material'
import FooterLayout from '../layouts/footer-layout'

export default function Root() {
    const pb = useContext(PocketBaseContext)
    const navigate = useNavigate()
    
    console.log(pb)
    if (!pb.authStore.isValid) {
        return (<Navigate to='/login' />)
    }
    return (
        <div>
            <CssBaseline />
            <HeaderLayout />
            <Container>
                <Outlet />
            </Container>
            <FooterLayout />
        </div>
    )
}