import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function AppNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">Front Start</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Главная</Nav.Link>
            <Nav.Link as={NavLink} to="/astronomy">Астрономия</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;


