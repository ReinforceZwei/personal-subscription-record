
import { useEffect, useState, useContext } from 'react'
import { Outlet, useNavigate } from "react-router-dom"
import Container from 'react-bootstrap/Container'
import { PocketBaseContext } from '../main'
import HeaderLayout from '../layouts/header-layout'
import SideNavLayout from '../layouts/side-nav-layout'
import { Stack } from 'react-bootstrap'

export default function Root() {
    const pb = useContext(PocketBaseContext)
    const navigate = useNavigate()
    
    if (!pb.authStore.isValid) {
        navigate("/login")
    }
    return (
        <div>
            <HeaderLayout />
            <Stack direction='horizontal'>
                <Container>
                    <Outlet />
                </Container>
            </Stack>
            
        </div>
    )
}