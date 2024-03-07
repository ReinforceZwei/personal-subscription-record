import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink } from "react-router-dom"

export default function HeaderLayout() {
    return (
        <Navbar className='bg-body-tertiary' expand="md" collapseOnSelect>
            <Container>
                <Navbar.Brand>Subscription Record</Navbar.Brand>
                <Navbar.Toggle />

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link href="/spentRecord" as={NavLink} to="/spentRecord">Records</Nav.Link>
                        <Nav.Link href="/quickCreate" as={NavLink} to="/quickCreate">Create</Nav.Link>
                        <Nav.Link href="/config" as={NavLink} to="/config">Config</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/logout" as={NavLink} to="/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}