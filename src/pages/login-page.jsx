import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../main"
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
            <Container maxWidth='sm'>
                <Paper sx={{ margin: 2, padding: 2 }}>
                    <Typography variant="h4">SSRS</Typography>
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
                                            label='Username'
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
                                            label='Password'
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
                                <Button type='submit' variant="outlined">Login</Button>
                            </Grid>
                            {loginError && (
                                <Grid xs={12}>
                                    <Alert severity="error">Login failed: {loginError}</Alert>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Paper>
                <Divider>Or</Divider>
                <Box textAlign='center'>
                    <ButtonGroup orientation="vertical" variant="outlined" size="large">
                        <Button variant="outlined" startIcon={<GitHubIcon />} onClick={handleGithub}>Signin with Github</Button>
                    </ButtonGroup>
                </Box>
            </Container>
            {/* <Container>
                <Stack gap={2} className="col-md-5 mx-auto">
                    <h3>Login</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <Button type="submit">Login</Button>
                        </div>
                    </Form>
                    <hr />
                    <p>Or login using</p>
                    <div className="btn-group-vertical">
                        {authMethods.map((method) => (
                            <Button variant="outline-primary" onClick={handleGithub}>{method.displayName}</Button>
                        ))}
                    </div>
                </Stack>
            </Container> */}
        </div>
    )
}