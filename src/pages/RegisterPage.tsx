import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './styles/AuthPages.css';

function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const baseUrl = import.meta.env.BASE_URL || '/';
  const backgroundUrl = `${baseUrl}background.jpg`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ login: loginValue, password }));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="frame auth-frame">
      <img
        className="img"
        src={backgroundUrl}
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.includes('background.jpg')) {
            t.src = backgroundUrl;
          }
        }}
        alt="Background"
      />
      <img
        className="img img-mirror"
        src={backgroundUrl}
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.includes('background.jpg')) {
            t.src = backgroundUrl;
          }
        }}
        alt="Background mirror"
      />

      <div className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Логин</label>
            <input
              className="form-control"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
            {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
          <div className="auth-footer">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;


