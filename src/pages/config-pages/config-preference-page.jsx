import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, InputAdornment } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createUserSettings, fetchUserSettings, selectUserSettings, updateUserSettings } from "../../redux/userSettingsSlice";
import { useContext, useEffect, useState } from "react";
import Grid from '@mui/material/Unstable_Grid2'
import { Link, useNavigate } from 'react-router-dom'
import { PocketBaseContext } from "../../main";
import { removePbDefaultField } from "../../vendors/pocketbaseUtils"
import ConfirmDeleteDialog from "../../components/confirm-delete-dialog";

const defaultSettings = {
    'default_page': 'spentRecord',
    'color_mode': 'system',
}

const defaultPageOption = [
    { name: 'Spent Record', value: 'spentRecord' },
    { name: 'Quick Create', value: 'quickCreate' },
]

const colorModeOption = [
    { name: 'Light Mode', value: 'light' },
    { name: 'Dark Mode', value: 'dark' },
    { name: 'Follow System Setting', value: 'system' },
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
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userSettings = useSelector(selectUserSettings)
    
    const [inputBudget, setInputBudget] = useState(userSettings.budget_per_month || 0)

    const [showConfirmLogout, setShowConfirmLogout] = useState(false)

    useEffect(() => {
        dispatch(fetchUserSettings())

    }, [])

    useEffect(() => {
        if (userSettings === null) {
            dispatch(createUserSettings({ defaultSettings, id: pb.authStore.model.id }))
        }
    }, [userSettings])

    const handleSetDefaultPage = (e) => {
        const data = {
            ...removePbDefaultField(userSettings),
            default_page: e.target.value,
        }
        dispatch(updateUserSettings({ id: userSettings.id, data }))
    }

    const handleSetColorMode = (e) => {
        const data = {
            ...removePbDefaultField(userSettings),
            color_mode: e.target.value,
        }
        dispatch(updateUserSettings({ id: userSettings.id, data }))
    }

    const handleSetBudget = () => {
        const data = {
            ...removePbDefaultField(userSettings),
            budget_per_month: Number(inputBudget),
        }
        dispatch(updateUserSettings({ id: userSettings.id, data }))
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
                                <InputLabel>Startup Page</InputLabel>
                                <Select
                                    fullWidth
                                    label='Startup Page'
                                    value={userSettings.default_page}
                                    onChange={handleSetDefaultPage}
                                >
                                    {defaultPageOption.map(({ name, value }) => (
                                        <MenuItem key={value} value={value} >{name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Which page to show when app open</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Color Mode</InputLabel>
                                <Select
                                    fullWidth
                                    label='Color Mode'
                                    value={userSettings.color_mode}
                                    onChange={handleSetColorMode}
                                >
                                    {colorModeOption.map(({ name, value }) => (
                                        <MenuItem key={value} value={value} >{name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>App color mode</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label='Month Budget'
                                    variant="outlined"
                                    type="number"
                                    inputMode="decimal"
                                    inputProps={{ inputMode: 'decimal' }}
                                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                    value={inputBudget}
                                    onChange={(e) => setInputBudget(e.target.value)}
                                    onBlur={handleSetBudget}
                                />
                                <FormHelperText>Total budget for each month</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={6}>
                            <Button variant="outlined" fullWidth onClick={() => handleConfirmLogout()}>Logout</Button>
                            {showConfirmLogout && 
                                <ConfirmDeleteDialog
                                    open={showConfirmLogout}
                                    title="Confirm Logout?"
                                    confirmActionText="Logout"
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