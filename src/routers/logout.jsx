import { useDispatch } from "react-redux";
import { baseApi } from "../redux/api";
import pocketbase from "../services/pocketbase";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

export default function Logout() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    dispatch(baseApi.util.resetApiState())
    pocketbase.authStore.clear()
    useEffect(() => {
        supabase.auth.signOut().then(() => setLoading(false))
    }, [])
    
    if (loading) return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <CircularProgress />
        </div>
    )
    return (<Navigate to='/login' />)
}