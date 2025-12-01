import { Day, normalizeImageUrl } from '../api/servicesApi';
import './styles/ServiceCard.css';

interface ServiceCardProps {
  day: Day;
}

const MOCK_IMAGE = '/asteroids.png'; // лежит в public

function ServiceCard({ day }: ServiceCardProps) {
  const imageUrl = normalizeImageUrl(day.image_url, MOCK_IMAGE);

  return (
    <div className="service-card">
      {imageUrl && (
        <img src={imageUrl} alt={day.name} className="service-card-image" />
      )}
      <div className="service-card-content">
        <h3>{day.name}</h3>
        <p>{day.description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;


