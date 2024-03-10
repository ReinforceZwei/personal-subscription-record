import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink } from "react-router-dom"
import { BsCollectionFill } from "react-icons/bs";
import { Stack } from 'react-bootstrap'
import { BsCoin } from "react-icons/bs";

export default function HeaderLayout() {
    return (
        <Navbar className='bg-body-tertiary' expand="md" collapseOnSelect sticky="top">
            <Container>
                <Navbar.Brand>
                    <Stack direction='horizontal' gap={1}><BsCoin className='fs-1' /> Subscription Record</Stack>
                    
                </Navbar.Brand>
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