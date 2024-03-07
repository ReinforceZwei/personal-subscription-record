import { Nav } from "react-bootstrap"
import { NavLink } from "react-router-dom"

export default function SideNavLayout() {
    return (
        <Nav defaultActiveKey="/home" className="flex-column">
            <NavLink to="/spentRecord" className="nav-link" role="button">Spent Records</NavLink>
            <Nav.Item>
                <NavLink to="/spentRecord" className="nav-link" role="button">Spent Records</NavLink>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link>ASDSD</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}