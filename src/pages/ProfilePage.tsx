import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ProfileService } from '../api/generated';
import './styles/ProfilePage.css';

function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [loginValue, setLoginValue] = useState(user?.login ?? '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.BASE_URL || '/';
  const backgroundUrl = `${baseUrl}background.jpg`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await ProfileService.updateProfile({
        requestBody: {
          login: loginValue || undefined,
          password: password || undefined,
        },
      });
      setMessage('Профиль обновлён');
    } catch (e: any) {
      setError(e?.message || 'Ошибка обновления профиля');
    }
  };

  return (
    <div className="frame profile-frame">
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

      <div className="profile-content">
        <h2 className="profile-title">Личный кабинет</h2>

        {!user ? (
          <p className="profile-text">Для доступа к личному кабинету нужно выполнить вход.</p>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="mb-3">
              <label className="form-label">Логин</label>
              <input
                className="form-control"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Новый пароль</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="form-text">Оставьте пустым, если не хотите менять пароль.</div>
            </div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;



