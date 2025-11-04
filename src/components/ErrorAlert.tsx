import { Alert, Button } from 'react-bootstrap';

function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert variant="danger" className="d-flex justify-content-between align-items-center">
      <div>{message}</div>
      {onRetry && (
        <Button variant="outline-danger" size="sm" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </Alert>
  );
}

export default ErrorAlert;


