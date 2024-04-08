import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, InputAdornment } from "@mui/material";
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "../../redux/userSettingsSlice";
import { useContext, useEffect, useState } from "react";
import Grid from '@mui/material/Unstable_Grid2'
import { Link, useNavigate } from 'react-router-dom'
import { removePbDefaultField } from "../../vendors/pocketbaseUtils"
import ConfirmDeleteDialog from "../../components/confirm-delete-dialog";

const defaultSettings = {
    'default_page': 'spentRecord',
    'color_mode': 'system',
}

const defaultPageOption = [
    { name: '支出記錄', value: 'spentRecord' },
    { name: '快速建立', value: 'quickCreate' },
]

const colorModeOption = [
    { name: '淺色', value: 'light' },
    { name: '深色', value: 'dark' },
    { name: '跟隨系統設定', value: 'system' },
]

function Loading() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }}>
            <CircularProgress />
        </Box>
    )
}

export default function ConfigPreferencePage() {
    const navigate = useNavigate()

    const { data: userSettings } = useGetUserSettingsQuery(defaultSettings)
    const [updateUserSettings] = useUpdateUserSettingsMutation()

    const [showConfirmLogout, setShowConfirmLogout] = useState(false)


    const handleSetDefaultPage = (e) => {
        const data = {
            ...removePbDefaultField(userSettings),
            default_page: e.target.value,
        }
        updateUserSettings({ id: userSettings.id, data })
    }

    const handleSetColorMode = (e) => {
        const data = {
            ...removePbDefaultField(userSettings),
            color_mode: e.target.value,
        }
        updateUserSettings({ id: userSettings.id, data })
    }

    const handleConfirmLogout = (e) => {
        setShowConfirmLogout(true)
    }

    const logout = () => {
        navigate('/logout')
    }


    return (
        <Box>
            {(userSettings == null || !userSettings.id) ? (<Loading />) : (
                <Box>
                    <Grid container spacing={3} columns={{ xs: 6, sm: 12}}>
                        <Grid xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>起始頁面</InputLabel>
                                <Select
                                    fullWidth
                                    label='起始頁面'
                                    value={userSettings.default_page}
                                    onChange={handleSetDefaultPage}
                                >
                                    {defaultPageOption.map(({ name, value }) => (
                                        <MenuItem key={value} value={value} >{name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>開啟APP時預設顯示哪一個頁面</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>顏色外觀</InputLabel>
                                <Select
                                    fullWidth
                                    label='顏色外觀'
                                    value={userSettings.color_mode}
                                    onChange={handleSetColorMode}
                                >
                                    {colorModeOption.map(({ name, value }) => (
                                        <MenuItem key={value} value={value} >{name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>APP的顏色外觀</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={6}>
                            <Button variant="outlined" fullWidth onClick={() => handleConfirmLogout()}>登出</Button>
                            {showConfirmLogout && 
                                <ConfirmDeleteDialog
                                    open={showConfirmLogout}
                                    title="確定要登出嗎？"
                                    confirmActionText="登出"
                                    cancelActionText="取消"
                                    onConfirm={() => logout()}
                                    onClose={() => setShowConfirmLogout(false)}
                                />
                            }
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    )
}