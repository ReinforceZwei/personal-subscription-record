import { Box, Button, Chip, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, InputAdornment, SelectChangeEvent } from "@mui/material";
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "../../redux/userSettingsSlice";
import { useContext, useEffect, useMemo, useState } from "react";
import Grid from '@mui/material/Grid2'
import { Link, useNavigate } from 'react-router-dom'
import { removePbDefaultField } from "../../vendors/pocketbaseUtils"
import ConfirmDeleteDialog from "../../components/confirm-delete-dialog";
import commonCurrency from "../../commonCurrency"

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

    const { data: userSettings } = useGetUserSettingsQuery()
    const [updateUserSettings] = useUpdateUserSettingsMutation()

    const [showConfirmLogout, setShowConfirmLogout] = useState(false)
    const [selectFavCurrency, setSelectFavCurrency] = useState<string[]>([])

    const currencyList = useMemo(() => {
        return Object.keys(commonCurrency).map(key => commonCurrency[key]).sort((a, b) => a.code > b.code ? 1 : -1)
    }, [commonCurrency])

    const handleSetDefaultPage = (e: SelectChangeEvent) => {
        const data = {
            ...removePbDefaultField(userSettings),
            default_page: e.target.value,
        }
        updateUserSettings({ id: userSettings!.id, data })
    }

    const handleSetColorMode = (e: SelectChangeEvent) => {
        const data = {
            ...removePbDefaultField(userSettings),
            color_mode: e.target.value,
        }
        updateUserSettings({ id: userSettings!.id, data })
    }

    const handleSetFavCurrency = (e: SelectChangeEvent<string[]>) => {
        setSelectFavCurrency(e.target.value as string[])
    }

    const handleCloseFavCurrency = () => {
        if (userSettings?.fav_currency
            && selectFavCurrency.length === userSettings.fav_currency.length 
            && selectFavCurrency.every((value, index) => value === userSettings.fav_currency![index])) {
            // value are the same, no need update
        } else {
            const data = {
                ...removePbDefaultField(userSettings),
                fav_currency: selectFavCurrency,
            }
            updateUserSettings({ id: userSettings!.id, data })
        }
    }

    const handleConfirmLogout = () => {
        setShowConfirmLogout(true)
    }

    const logout = () => {
        navigate('/logout')
    }

    useEffect(() => {
        if (userSettings) {
            setSelectFavCurrency(userSettings?.fav_currency || [])
        }
    }, [userSettings])


    return (
        <Box>
            <Box>
                <Grid container spacing={3} columns={{ xs: 6, sm: 12}}>
                    {(userSettings == null || !userSettings.id) ? (<Loading />) : (
                    <>
                    <Grid size={6}>
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

                    <Grid size={6}>
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

                    <Grid size={6}>
                        <FormControl fullWidth>
                            <InputLabel>喜好貨幣</InputLabel>
                            <Select
                                fullWidth
                                label='喜好貨幣'
                                value={selectFavCurrency}
                                onChange={handleSetFavCurrency}
                                onClose={handleCloseFavCurrency}
                                multiple
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {currencyList.map(({ code, name }) => (
                                    <MenuItem key={code} value={code}>{code} - {name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>用於貨幣轉換計算機</FormHelperText>
                        </FormControl>
                    </Grid>
                    </>
                    )}
                    <Grid size={6}>
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
        </Box>
    );
}