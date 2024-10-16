import { useContext, useEffect, useMemo, useState } from "react"
import { PocketBaseContext } from "../context"
import { USER_COL } from "../services/pocketbase"
import { Navigate, useNavigate } from "react-router-dom"
import { Alert, Box, Button, ButtonGroup, Container, CssBaseline, Divider, Paper, TextField, Typography } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton'
import { Controller, useForm } from "react-hook-form"
import Grid from "@mui/material/Unstable_Grid2"
import _ from 'lodash-es'
import GitHubIcon from '@mui/icons-material/GitHub';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';
import { AuthProviderInfo } from "pocketbase"

type FormValues = {
    username: string
    password: string
}

export default function LoginPage() {
    const pb = useContext(PocketBaseContext)!
    const navigate = useNavigate()
    const [authMethods, setAuthMethods] = useState<AuthProviderInfo[]>([])
    const [loginError, setLoginError] = useState('')
    
    const { handleSubmit, reset, setValue, setFocus, control, formState } = useForm<FormValues>()

    const { isSubmitting } = formState

    useEffect(() => {
        let getAuthMethods = async () => {
            let methods = await pb.collection(USER_COL).listAuthMethods()
            setAuthMethods(methods.authProviders)
        }
        getAuthMethods()
    }, [])

    const handleLogin = async ({ username, password }: FormValues) => {
        try {
            await pb.collection('users').authWithPassword(username, password)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoginError(error?.message || 'Unknown error')
        }
        // pb.collection('users').authWithPassword(username, password)
        // .then(authData => {
        //     navigate("/")
        // })
        // .catch(err => {
        //     console.log(err)
        //     setLoginError(err?.message || 'Unknown error')
        // })
    }

    const handleOauth = (providerName: string) => {
        let w = window.open()!
        pb.collection('users').authWithOAuth2({
            provider: providerName,
            urlCallback: (url) => {
                w.location.href = url
            },
        })
        .then(authData => {
            navigate("/")
        })
    }

    const getProviderIcon = (name: string) => {
        switch (name) {
            case 'github': return <GitHubIcon />
            case 'apple': return <AppleIcon />
            case 'google': return <GoogleIcon />
            case 'microsoft': return <MicrosoftIcon />
            case 'facebook': return <FacebookIcon />
            default: return <LanguageIcon />
        }
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
                                <LoadingButton type='submit' variant="outlined" loading={isSubmitting}>登入</LoadingButton>
                            </Grid>
                            {loginError && (
                                <Grid xs={12}>
                                    <Alert severity="error">登入失敗: {loginError}</Alert>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Paper>
                { !!authMethods?.length && (
                    <>
                    <Divider>或</Divider>
                    { authMethods.map((method) => (
                        <Box textAlign='center' mt={1} key={method.name}>
                            <ButtonGroup orientation="vertical" variant="outlined" size="large">
                                <Button variant="outlined" startIcon={getProviderIcon(method.name)} onClick={() => handleOauth(method.name)}>使用 {method.displayName} 登入</Button>
                            </ButtonGroup>
                        </Box>
                    )) }
                    
                    </>
                ) }
                
            </Container>
        </div>
    )
}