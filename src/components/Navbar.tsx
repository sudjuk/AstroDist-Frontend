import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

function AppNavbar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const isActive = (path: string) => {
    // Для HashRouter путь находится в location.hash
    const hashPath = location.hash.replace('#', '') || '/';
    return hashPath === path || location.pathname === path;
  };

  return (
    <BSNavbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <BSNavbar.Brand as={Link} to="/">AstroDist</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={isActive('/')}>
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/astronomy" active={isActive('/astronomy')}>
              Услуги
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/requests" active={isActive('/requests')}>
                  Мои заявки
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" active={isActive('/profile')}>
                  {user.login}
                </Nav.Link>
                <Nav.Link
                  onClick={() => dispatch(logout())}
                  style={{ cursor: 'pointer' }}
                >
                  Выйти
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" active={isActive('/login')}>
                  Войти
                </Nav.Link>
                <Nav.Link as={Link} to="/register" active={isActive('/register')}>
                  Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default AppNavbar;
