import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, InputAdornment, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createUserSettings, fetchUserSettings, selectUserSettings, updateUserSettings } from "../../redux/userSettingsSlice";
import { useContext, useEffect, useState } from "react";
import Grid from '@mui/material/Unstable_Grid2'
import { Link, useNavigate } from 'react-router-dom'
import { PocketBaseContext } from "../../main";
import { removePbDefaultField } from "../../vendors/pocketbaseUtils"
import ConfirmDeleteDialog from "../../components/confirm-delete-dialog";
import { updateOrCreateBudget, useGetBudgetQuery, useUpdateBudgetMutation } from "../../redux/budgetSlice";
import { DateTime } from "luxon";
import { useForm, Controller } from "react-hook-form";


export default function ConfigBudgetPage() {
    const pb = useContext(PocketBaseContext)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: currentBudget } = useGetBudgetQuery(DateTime.now().endOf('month').toISO())
    const [updateBudget] = useUpdateBudgetMutation()

    const { handleSubmit, reset, setValue, setFocus, control, formState } = useForm({
        defaultValues: {
            budget: currentBudget?.budget,
        }
    })

    const isModified = formState.isDirty

    useEffect(() => {
        if (currentBudget?.budget) {
            reset({
                budget: currentBudget.budget
            })
        }
    }, [currentBudget])

    const onSave = (data) => {
        const modified = formState.dirtyFields
        let promises = []
        if (modified.budget) {
            promises.push(
                updateBudget(data.budget).unwrap()
            )
        }
        
        if (promises) {
            Promise.all(promises)
            .then(() => {
                reset({}, { keepValues: true })
            })
        }
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSave)}>
                <Grid container spacing={3} columns={{ xs: 6, sm: 12}}>
                    <Grid xs={6}>
                        <FormControl fullWidth>
                        <Controller
                            render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                <TextField
                                    fullWidth
                                    label='每月預算'
                                    variant="outlined"
                                    type="number"
                                    inputMode="decimal"
                                    inputProps={{ inputMode: 'decimal' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                                    }}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={disabled}
                                    inputRef={ref}
                                    name={name}
                                />
                            )}
                            name='budget'
                            control={control}
                        />
                        <FormHelperText>每月總預算，不包括訂閱項目</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid xs={6} sm={12}>
                        <Button type="submit" variant="outlined" disabled={!isModified}>儲存</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}