import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createUserSettings, fetchUserSettings, selectUserSettings, updateUserSettings } from "../../redux/userSettingsSlice";
import { useContext, useEffect } from "react";
import Grid from '@mui/material/Unstable_Grid2'
import { PocketBaseContext } from "../../main";

const defaultSettings = {
    'default_page': 'spentRecord',
}

const defaultPageOption = [
    { name: 'Spent Record', value: 'spentRecord' },
    { name: 'Quick Create', value: 'quickCreate' },
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

    const userSettings = useSelector(selectUserSettings)

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
            owned_by: userSettings.owned_by,
            default_page: e.target.value,
        }
        dispatch(updateUserSettings({ id: userSettings.id, data }))
    }


    return (
        <Box>
            {(userSettings == null || !userSettings.id) ? (<Loading />) : (
                <Box>
                    <Grid container spacing={1}>
                        <Grid xs={12}>
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
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    )
}