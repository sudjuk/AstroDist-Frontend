import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getServices, DayDTO } from '../api/servicesApi';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import './styles/AstronomyListPage.css';

function AstronomyListPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<DayDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(params.get('name') || '');

  // Получаем параметр фильтрации из URL
  const name = params.get('name') || '';

  /**
   * Функция загрузки данных с сервера
   * Использует fetch через прокси (см. vite.config.ts)
   * Вызывается автоматически при изменении параметра name в URL
   */
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // fetch запрос: GET /api/days?name=... (проксируется на localhost:8080)
      // Функция getServices обрабатывает ошибки и возвращает mock при недоступности бэка
      const data = await getServices(name);
      setItems(data);
    } catch (e) {
      setError('Не удалось загрузить список.');
    } finally {
      setLoading(false);
    }
  };

  // Хук useEffect - автоматически загружает данные при изменении параметра name в URL
  // Зависимость [name] означает, что эффект выполнится при каждом изменении name
  useEffect(() => { load(); }, [name]);
  
  // Синхронизация значения инпута с URL (если URL изменился извне, например, через браузерную навигацию)
  useEffect(() => {
    setInputValue(params.get('name') || '');
  }, [params]);

  /**
   * Обработчик отправки формы (нажатие Enter)
   * Обновляет URL параметр name, что триггерит useEffect и загружает данные
   * 
   * Props функции: e - React.FormEvent (событие формы)
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(params);
    if (inputValue.trim()) {
      newParams.set('name', inputValue.trim());
    } else {
      newParams.delete('name');
    }
    // setParams обновляет URL, что вызывает useEffect выше и загружает данные
    setParams(newParams);
  };

  return (
    <div className="frame">
      <div className="div-wrapper">
        <Link to="/" className="text-wrapper-3">AstroDist</Link>
        <nav className="nav-right"><Link to="/astronomy" className="nav-link-right">Days</Link></nav>
      </div>
      <img className="img" src="http://localhost:9000/pictures/background.jpg" />
      <img className="img img-mirror" src="http://localhost:9000/pictures/background.jpg" />

      <div className="group">
        <div className="rectangle"></div>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Введите дату (например: 21.02.2025)"
            className="search-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
      </div>

      {loading && <Loader />}
      {error && <ErrorAlert message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="days-grid">
          {items.map(d => (
            <div className="day-card" key={d.id}>
              <img
                className="image"
                src={d.image && d.image.trim() ? d.image : '/earth.png'}
                onError={(e) => { const t = e.currentTarget; if (t.src !== window.location.origin + '/earth.png') t.src = '/earth.png'; }}
                alt={d.date}
              />
              <div className="text-wrapper-4">{d.date}</div>
              <p className="RA-DEC">
                Координаты Земли относительно Солнца в этот день: <br />
                RA: {d.earthRA?.toFixed(4)}° <br />DEC: {d.earthDEC?.toFixed(4)}°
              </p>
              <div className="div-3">
                <span className="group-3">
                  <div className="rectangle-2"></div>
                  <div className="text-wrapper-5">Добавить</div>
                </span>
                <Link to={`/day_details/${d.id}`} className="group-4">
                  <div className="rectangle-3"></div>
                  <div className="text-wrapper-6">Подробнее</div>
                </Link>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-muted">Ничего не найдено.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AstronomyListPage;


