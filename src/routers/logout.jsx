import { useDispatch } from "react-redux";
import { baseApi } from "../redux/api";
import pocketbase from "../services/pocketbase";
import { Navigate } from "react-router-dom";

export default function Logout() {
    const dispatch = useDispatch()

    dispatch(baseApi.util.resetApiState())
    pocketbase.authStore.clear()

    return (<Navigate to='/login' />)
}