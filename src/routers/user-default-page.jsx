import { useDispatch, useSelector } from "react-redux";
import { fetchUserSettings, selectUserSettings } from "../redux/userSettingsSlice";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";

function Loading() {
    return (
        <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <LinearProgress />
        </Box>
    )
}

export default function UserDefaultPage() {
    const dispatch = useDispatch()

    const userSettings = useSelector(selectUserSettings)
    const defaultPage = userSettings == null ? 'spentRecord' : userSettings['default_page'] || 'loading'

    

    let page = <Navigate to='/spentRecord' />//<SpentRecordPage />

    switch (defaultPage) {
        case 'spentRecord': page = <Navigate to='/spentRecord' />; break
        case 'quickCreate': page = <Navigate to='/quickCreate' />; break
        default: page = <Loading />; break
    }

    return page
}