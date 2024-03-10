import { useContext, useEffect, useState } from "react"
import { PocketBaseContext } from "../main"
import { USER_COL } from "../services/pocketbase"
import { Button, Container, ListGroup, Stack } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import { Navigate, useNavigate } from "react-router-dom"

export default function LoginPage() {
    const pb = useContext(PocketBaseContext)
    const navigate = useNavigate()
    const [authMethods, setAuthMethods] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        let getAuthMethods = async () => {
            let methods = await pb.collection(USER_COL).listAuthMethods()
            setAuthMethods(methods.authProviders)
        }
        getAuthMethods()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(username, password)
        pb.collection('users').authWithPassword(username, password)
        .then(authData => {
            navigate("/")
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
            <Container>
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
            </Container>
        </div>
    )
}