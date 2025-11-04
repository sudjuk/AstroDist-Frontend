import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export interface Service {
  id: number;
  date: string;
  fullInfo: string;
  image?: string;
}

const DEFAULT_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><rect width="100%" height="100%" fill="#e9ecef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6c757d" font-family="Arial, Helvetica, sans-serif" font-size="18">Нет изображения</text></svg>'
)}`;

function ServiceCard({ id, date, fullInfo, image }: Service) {
  const src = image && image.trim().length > 0 ? image : DEFAULT_PLACEHOLDER;
  return (
    <Card className="h-100">
      <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
        <Card.Img variant="top" src={src} alt={date} loading="lazy" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{date}</Card.Title>
        <Card.Text className="text-truncate" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {fullInfo}
        </Card.Text>
        <div className="mt-auto">
          <Button as={Link} to={`/day_details/${id}`} variant="primary" size="sm">Подробнее</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ServiceCard;


