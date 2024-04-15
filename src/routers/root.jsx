
import { useEffect, useState, useContext } from 'react'
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { PocketBaseContext, SupabaseContext } from '../context'
import HeaderLayout from '../layouts/header-layout'
import Stack from '@mui/material/Stack'
import { Container, CssBaseline } from '@mui/material'
import FooterLayout from '../layouts/footer-layout'

export default function Root() {
    const pb = useContext(PocketBaseContext)
    const supabase = useContext(SupabaseContext)
    const navigate = useNavigate()

    const [session, setSession] = useState({})
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
        })
    }, [])
    
    if (session === null) {
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