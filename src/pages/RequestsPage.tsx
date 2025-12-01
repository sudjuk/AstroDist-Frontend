import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRequests } from '../store/slices/requestsSlice';
import { fetchCartInfo } from '../store/slices/cartSlice';
import './styles/RequestsPage.css';

function RequestsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items, loading, error } = useAppSelector((s) => s.requests);
  const { draftId, count } = useAppSelector((s) => s.cart);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL || '/';
  const backgroundUrl = `${baseUrl}background.jpg`;

  useEffect(() => {
    if (user) {
      dispatch(fetchRequests());
      dispatch(fetchCartInfo());
    }
  }, [user, dispatch]);

  return (
    <div className="frame requests-frame">
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

      <div className="requests-content">
        <h2 className="requests-title">Мои заявки</h2>
        {!user ? (
          <p className="requests-text">Для просмотра заявок нужно выполнить вход.</p>
        ) : (
          <>
            {draftId > 0 && count > 0 && (
              <>
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Статус</th>
                      <th>Дата формирования</th>
                      <th>Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className="request-row request-draft-row"
                      onClick={() => navigate(`/requests/${draftId}`)}
                    >
                      <td>{draftId} (черновик)</td>
                      <td>draft</td>
                      <td>-</td>
                      <td>
                        Услуг в заявке: {count}
                        <span className="requests-draft-note"> — нажмите, чтобы продолжить редактирование</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {loading && <p className="requests-text">Загрузка заявок...</p>}
            {error && <p className="requests-text">Ошибка: {error}</p>}

            {!loading && !error && items.length > 0 && (
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Статус</th>
                    <th>Дата формирования</th>
                    <th>Клиент</th>
                    <th>Модератор</th>
                    <th>Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr
                      key={r.id}
                      className="request-row"
                      onClick={() => navigate(`/requests/${r.id}`)}
                    >
                      <td>{r.id}</td>
                      <td>{r.status}</td>
                      <td>{r.formedAt ?? '-'}</td>
                      <td>{r.creatorLogin}</td>
                      <td>{r.moderatorLogin ?? '-'}</td>
                      <td>{r.comment ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && !error && draftId <= 0 && items.length === 0 && (
              <p className="requests-empty">У вас пока нет заявок.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RequestsPage;



