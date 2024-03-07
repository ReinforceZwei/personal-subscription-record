import { Nav } from "react-bootstrap"
import { Outlet, NavLink } from "react-router-dom"

export default function ConfigPage() {
    return (
        <div>
            <h1>This is config page</h1>
            <Nav variant="tabs" defaultActiveKey="type">
                <Nav.Item>
                    <Nav.Link href="type" as={NavLink} to="type">Type</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="payment" as={NavLink} to="payment">Payment</Nav.Link>
                </Nav.Item>
            </Nav>
            <div>
                <Outlet />
            </div>
        </div>
    )
}