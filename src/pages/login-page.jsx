import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../app"
import { USER_COL } from "../services/pocketbase"
import { Navigate, useNavigate } from "react-router-dom"
import { Alert, Box, Button, ButtonGroup, Container, CssBaseline, Divider, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Typography } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import Grid from "@mui/material/Unstable_Grid2"
import GitHubIcon from '@mui/icons-material/GitHub';

export default function LoginPage() {
    const pb = useContext(PocketBaseContext)
    const navigate = useNavigate()
    const [authMethods, setAuthMethods] = useState([])
    const [loginError, setLoginError] = useState('')
    
    const { handleSubmit, reset, setValue, setFocus, control } = useForm()

    useEffect(() => {
        let getAuthMethods = async () => {
            let methods = await pb.collection(USER_COL).listAuthMethods()
            setAuthMethods(methods.authProviders)
        }
        getAuthMethods()
    }, [])

    const handleLogin = ({ username, password }) => {
        pb.collection('users').authWithPassword(username, password)
        .then(authData => {
            navigate("/")
        })
        .catch(err => {
            console.log(err)
            setLoginError(err?.message || 'Unknown error')
        })
    }

    const handleGithub = (e) => {
        let w = window.open()
        pb.collection('users').authWithOAuth2({
            provider: 'github',
            urlCallback: (url) => {
                w.location.href = url
            },
        })
        .then(authData => {
            navigate("/")
        })
    }

    return (
        <div>
            {pb.authStore.isValid && <Navigate to="/" />}
            <CssBaseline />
            <Container maxWidth='sm' sx={{mt: 5}}>
                <Paper sx={{ margin: 2, padding: 2 }}>
                    <Box mb={1}>
                        <Typography variant="h4">SSRS</Typography>
                        <Typography variant="subtitle1">訂閱與支出記錄</Typography>
                        <Typography variant="subtitle1">Subscription & Spending Record System</Typography>
                    </Box>
                    
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <Grid container spacing={2}>
                            <Grid xs={12}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='登入名稱'
                                            fullWidth
                                        />
                                    )}
                                    name='username'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <Controller
                                    render={({ field: { onBlur, onChange, ref, value, name, disabled } }) => (
                                        <TextField
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            inputRef={ref}
                                            value={value}
                                            name={name}
                                            disabled={disabled}
                                            label='密碼'
                                            type='password'
                                            fullWidth
                                        />
                                    )}
                                    name='password'
                                    rules={{ required: true }}
                                    control={control}
                                />
                            </Grid>
                            <Grid xs={12} sx={{textAlign: 'center'}}>
                                <Button type='submit' variant="outlined">登入</Button>
                            </Grid>
                            {loginError && (
                                <Grid xs={12}>
                                    <Alert severity="error">登入失敗: {loginError}</Alert>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Paper>
                <Divider>或</Divider>
                <Box textAlign='center' mt={1}>
                    <ButtonGroup orientation="vertical" variant="outlined" size="large">
                        <Button variant="outlined" startIcon={<GitHubIcon />} onClick={handleGithub}>使用 Github 登入</Button>
                    </ButtonGroup>
                </Box>
            </Container>
        </div>
    )
}