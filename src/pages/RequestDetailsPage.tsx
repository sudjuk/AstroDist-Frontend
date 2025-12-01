import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AsteroidObservationsService } from '../api/generated';
import { normalizeImageUrl } from '../api/servicesApi';
import { useAppDispatch } from '../store/hooks';
import { fetchCartInfo } from '../store/slices/cartSlice';
import './styles/RequestDetailsPage.css';

interface ObservationDay {
  id: number;
  date: string;
  earthRA?: number;
  earthDEC?: number;
  asteroidRA?: number;
  asteroidDEC?: number;
  image?: string;
  asteroidRAInput: string;
  asteroidDECInput: string;
}

interface ObservationDetails {
  id: number;
  status: string;
  result?: number;
}

function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observation, setObservation] = useState<ObservationDetails | null>(null);
  const [items, setItems] = useState<ObservationDay[]>([]);
  const [isDraft, setIsDraft] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [saveCoordsLoading, setSaveCoordsLoading] = useState(false);
  const [saveAllLoading, setSaveAllLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const backgroundUrl = `${baseUrl}background.jpg`;

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const numericId = Number(id);
        const data: any = await AsteroidObservationsService.getApiAsteroidObservations1({
          id: numericId,
        });

        const rawObs = data?.observation || {};
        const normalizedObs: ObservationDetails = {
          id:
            rawObs.ID_observation ??
            rawObs.id ??
            rawObs.ID ??
            0,
          status:
            rawObs.Status_observation ??
            rawObs.Status ??
            rawObs.status ??
            '',
          result: rawObs.Result ?? rawObs.result,
        };

        const rawItems: any[] = Array.isArray(data?.items) ? data.items : [];
        const normalizedItems: ObservationDay[] = rawItems.map((row: any) => {
          const asteroidRA =
            row.AstRA ?? row.AsteroidRA ?? row.asteroidRA ?? row.asteroid_ra;
          const asteroidDEC =
            row.AstDEC ?? row.AsteroidDEC ?? row.asteroidDEC ?? row.asteroid_dec;
          return {
            id: row.DayID ?? row.ID ?? row.id ?? 0,
            date: row.Date ?? row.date ?? row.Name ?? row.name ?? '',
            earthRA: row.EarthRA ?? row.earthRA ?? row.earth_ra,
            earthDEC: row.EarthDEC ?? row.earthDEC ?? row.earth_dec,
            asteroidRA,
            asteroidDEC,
            image: row.Image ?? row.ImageURL ?? row.image_url,
            asteroidRAInput:
              typeof asteroidRA === 'number' ? asteroidRA.toFixed(4) : '',
            asteroidDECInput:
              typeof asteroidDEC === 'number' ? asteroidDEC.toFixed(4) : '',
          };
        });

        setObservation(normalizedObs);
        setItems(normalizedItems);
        setComment(rawObs.Description ?? rawObs.description ?? '');
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки заявки');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Пока API не отдаёт статус заявки, считаем эту страницу черновиком,
  // а после успешного "Сформировать" переключаем локально.

  const earthFallback = `${baseUrl}earth.png`;

  const saveDayCoords = async (
    requestId: number,
    dayId: number,
    raInput: string,
    decInput: string
  ) => {
    const ra = raInput.trim();
    const dec = decInput.trim();
    const asteroidRA =
      ra !== '' && !Number.isNaN(Number(ra)) ? Number(ra) : undefined;
    const asteroidDEC =
      dec !== '' && !Number.isNaN(Number(dec)) ? Number(dec) : undefined;

    const response = await fetch('/api/asteroid-observation-items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        asteroidRequestId: requestId,
        dayId,
        asteroidRA,
        asteroidDEC,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Bad status');
    }
  };

  return (
    <main className="frame asteroid-request-page request-frame">
      <img
        className="img"
        src={backgroundUrl}
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.includes('background.jpg')) {
            t.src = backgroundUrl;
          }
        }}
        alt="Фон космоса"
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
        alt="Фон космоса (отражение)"
      />

      <header className="request-header">
        <div className="rectangle" role="presentation" />
        <h1 className="request-title">
          {loading
            ? 'Загрузка заявки...'
            : error
            ? `Ошибка: ${error}`
            : observation
            ? `Заявка № ${observation.id}`
            : 'Заявка не найдена'}
        </h1>
      </header>

      {!loading && !error && observation && (
        <section className="request-comment-section">
          <div className="comment-rectangle" />
          <input
            type="text"
            className="request-comment-input"
            placeholder="Комментарий к заявке (ФИО, контактные данные, примечания)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </section>
      )}

      {!loading && !error && observation && (
        <section className="asteroid-request-cards request-cards">
          {items.map((day, index) => {
            const date = day.date || '';
            const earthRA = day.earthRA;
            const earthDEC = day.earthDEC;
            const rawImage = day.image || '';
            const imageSrc = normalizeImageUrl(rawImage, earthFallback);

            const handleDelete = async () => {
              if (!observation?.id) return;
              try {
                const params = new URLSearchParams({
                  asteroidRequestId: String(observation.id),
                  dayId: String(day.id),
                });
                await fetch(`/api/asteroid-observation-items?${params.toString()}`, {
                  method: 'DELETE',
                  credentials: 'include',
                });
                setItems((prev) => prev.filter((d) => d.id !== day.id));
                dispatch(fetchCartInfo());
              } catch (e) {
                console.warn('Failed to delete item from observation', e);
              }
            };

            return (
              <article
                key={day.id || index}
                className="asteroid-request-card"
                aria-labelledby={`asteroid-entry-${index}`}
              >
                <img
                  className="image"
                  src={imageSrc}
                  alt="Изображение астероида"
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (!t.src.includes('earth.png')) {
                      t.src = earthFallback;
                    }
                  }}
                />
                <div className="element">
                  <span className="date-label">Дата:</span>
                  <time dateTime={date}>{date}</time>
                </div>
                <div className="RA-DEC">
                  <h3>Земля:</h3>
                  <div>RA: {earthRA?.toFixed(4)}°</div>
                  <div>DEC: {earthDEC?.toFixed(4)}°</div>
                </div>
                <div className="asteroid-block">
                  <div className="asteroid-header" />
                  <div className="asteroid-labels-row">
                    <div className="asteroid-label">Координаты астероида:</div>
                  </div>
                  <div className="asteroid-inputs-row">
                    <div className="asteroid-input-group">
                      <div className="group-2">
                        <div className="rectangle-3" />
                        <input
                          type="text"
                          className="RA"
                          placeholder="RA:"
                          aria-label="Прямое восхождение астероида"
                          value={day.asteroidRAInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            setItems((prev) =>
                              prev.map((d) =>
                                d.id === day.id ? { ...d, asteroidRAInput: value } : d
                              )
                            );
                          }}
                          readOnly={!isDraft}
                        />
                      </div>
                    </div>
                    <div className="asteroid-input-group">
                      <div className="group-2">
                        <div className="rectangle-3" />
                        <input
                          type="text"
                          className="DEC"
                          placeholder="DEC:"
                          aria-label="Склонение астероида"
                          value={day.asteroidDECInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            setItems((prev) =>
                              prev.map((d) =>
                                d.id === day.id ? { ...d, asteroidDECInput: value } : d
                              )
                            );
                          }}
                          readOnly={!isDraft}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {isDraft && (
                  <button
                    type="button"
                    className="btn btn-outline-danger delete-item-btn"
                    title="Удалить услугу"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash" aria-hidden="true" />
                    <span className="visually-hidden">Удалить услугу</span>
                  </button>
                )}
              </article>
            );
          })}
        </section>
      )}

      {!loading && !error && observation && items.length > 0 && (
        <div className="request-actions">
          {isDraft ? (
            <>
              {(submitError || saveError) && (
                <div className="alert alert-danger request-submit-alert">
                  {saveError || submitError}
                </div>
              )}
              <div className="btn-group gap-2 flex-wrap justify-content-center">
                <button
                  type="button"
                  className="btn btn-light request-submit-btn"
                  disabled={saveCoordsLoading}
                  onClick={async () => {
                    if (!observation?.id) return;
                    setSaveCoordsLoading(true);
                    setSaveError(null);
                    try {
                      await Promise.all(
                        items.map((day) => {
                          return saveDayCoords(
                            observation.id,
                            day.id,
                            day.asteroidRAInput,
                            day.asteroidDECInput
                          );
                        })
                      );
                    } catch (e: any) {
                      setSaveError(e?.message || 'Не удалось сохранить координаты');
                    } finally {
                      setSaveCoordsLoading(false);
                    }
                  }}
                >
                  {saveCoordsLoading ? 'Сохраняем координаты...' : 'Сохранить координаты'}
                </button>

                <button
                  type="button"
                  className="btn btn-light request-submit-btn"
                  disabled={saveAllLoading}
                  onClick={async () => {
                    if (!observation?.id) return;
                    setSaveAllLoading(true);
                    setSaveError(null);
                    try {
                      // сначала координаты
                      await Promise.all(
                        items.map((day) => {
                          return saveDayCoords(
                            observation.id,
                            day.id,
                            day.asteroidRAInput,
                            day.asteroidDECInput
                          );
                        })
                      );
                      // затем комментарий
                      await AsteroidObservationsService.putApiAsteroidObservations({
                        id: observation.id,
                        request: { comment },
                      });
                    } catch (e: any) {
                      setSaveError(e?.message || 'Не удалось сохранить заявку');
                    } finally {
                      setSaveAllLoading(false);
                    }
                  }}
                >
                  {saveAllLoading ? 'Сохраняем...' : 'Сохранить все поля'}
                </button>

                <button
                  type="button"
                  className="btn btn-danger request-submit-btn"
                  disabled={deleteLoading}
                  onClick={async () => {
                    if (!observation?.id) return;
                    setDeleteLoading(true);
                    setSaveError(null);
                    try {
                      await AsteroidObservationsService.deleteApiAsteroidObservations({
                        id: observation.id,
                      });
                      dispatch(fetchCartInfo());
                      navigate('/requests');
                    } catch (e: any) {
                      setSaveError(e?.message || 'Не удалось удалить заявку');
                      setDeleteLoading(false);
                    }
                  }}
                >
                  {deleteLoading ? 'Удаляем...' : 'Удалить заявку'}
                </button>

                <button
                  type="button"
                  className="btn btn-light request-submit-btn"
                  disabled={submitLoading}
                  onClick={async () => {
                    if (!observation?.id) return;
                    setSubmitLoading(true);
                    setSubmitError(null);
                    try {
                      await AsteroidObservationsService.putApiAsteroidObservationsSubmit({
                        id: observation.id,
                      });
                      setIsDraft(false);
                      dispatch(fetchCartInfo());
                    } catch (e: any) {
                      setSubmitError(e?.message || 'Не удалось сформировать заявку');
                    } finally {
                      setSubmitLoading(false);
                    }
                  }}
                >
                  {submitLoading ? 'Формируем...' : 'Сформировать заявку'}
                </button>
              </div>
            </>
          ) : (
            <div className="request-status-label">
              Заявка сформирована и больше не редактируется.
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default RequestDetailsPage;


