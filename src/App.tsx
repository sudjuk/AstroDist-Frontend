import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AstronomyListPage from './pages/AstronomyListPage';
import DayDetailPage from './pages/DayDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestsPage from './pages/RequestsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/astronomy" element={<AstronomyListPage />} />
        <Route path="/day_details/:id" element={<DayDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/:id" element={<RequestDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;


