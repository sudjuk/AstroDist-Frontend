import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getServiceById, DayDTO } from '../api/servicesApi';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import './styles/DayDetailPage.css';

function DayDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<DayDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getServiceById(id);
      setItem(data);
    } catch (e) {
      setError('Не удалось загрузить данные.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} onRetry={load} />;
  if (!item) return <div className="text-muted">Запись не найдена.</div>;

  return (
    <div className="frame">
      <div className="div-wrapper">
        <Link to="/" className="text-wrapper-3">AstroDist</Link>
        <nav className="nav-right"><Link to="/astronomy" className="nav-link-right">Days</Link></nav>
      </div>
      <img className="img" src="/background.jpg" />

      <div className="breadcrumbs">
        <Link to="/" className="crumb-link">Главная</Link>
        <span className="crumb-sep">/</span>
        <Link to="/astronomy" className="crumb-link">Астрономия</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{item.date}</span>
      </div>

      <div className="details-header">
        <div className="details-title">{item.date}</div>
      </div>
      <div className="details-text">
        <p className="bennu-RA">
          Земля:<br />RA: {item.earthRA?.toFixed(4)}° <br />DEC: {item.earthDEC?.toFixed(4)}° <br /> {item.bodiesText}
        </p>
      </div>
      <img
        className="details-image"
        src={'/asteroids.png'}
        onError={(e) => { const t = e.currentTarget; if (t.src !== window.location.origin + '/asteroids.png') t.src = '/asteroids.png'; }}
        alt={item.date}
      />

      {/* removed duplicate header block to avoid overlaying clickable navbar */}
    </div>
  );
}

export default DayDetailPage;


