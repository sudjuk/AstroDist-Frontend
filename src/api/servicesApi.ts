export interface Day {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  // Дополнительные поля из example
  date?: string;
  fullInfo?: string;
  earthRA?: number;
  earthDEC?: number;
  bodiesText?: string;
  asteroidRA?: number;
  asteroidDEC?: number;
}

// Мок данные из example
const MOCK: Day[] = [
  { 
    id: 1, 
    name: '21.02.2025',
    date: '21.02.2025',
    description: 'Астрономический день для расчёта координат Земли и астероидов.',
    fullInfo: 'Астрономический день для расчёта координат Земли и астероидов.',
    image_url: '',
    earthRA: 150.2345,
    earthDEC: 12.3456,
    bodiesText: 'Близкие к Земле астероиды: Bennu, Apophis'
  },
  { 
    id: 2, 
    name: '15.03.2025',
    date: '15.03.2025',
    description: 'Астрономический день для расчёта координат Земли и астероидов.',
    fullInfo: 'Астрономический день для расчёта координат Земли и астероидов.',
    image_url: '',
    earthRA: 165.7890,
    earthDEC: -5.6789,
    bodiesText: 'Близкие к Земле астероиды: 2004 MN4, 99942 Apophis'
  },
  { 
    id: 3, 
    name: '10.04.2025',
    date: '10.04.2025',
    description: 'Астрономический день для расчёта координат Земли и астероидов.',
    fullInfo: 'Астрономический день для расчёта координат Земли и астероидов.',
    image_url: '',
    earthRA: 180.1234,
    earthDEC: 8.9012,
    bodiesText: 'Близкие к Земле астероиды: 101955 Bennu, 25143 Itokawa'
  },
];

const RAW_API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
const API_BASE =
  RAW_API_BASE && RAW_API_BASE !== '/'
    ? RAW_API_BASE.replace(/\/+$/, '')
    : '';

function getApiBaseUrl(): string {
  return API_BASE;
}

function withApiBase(path: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return path;
  }
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

// Функция для нормализации URL изображения
function replaceLocalhostWithBaseHost(url: string): string {
  if (!url.includes('localhost')) {
    return url;
  }

  const base = getApiBaseUrl();
  if (!base) {
    return url;
  }

  try {
    const baseUrl = new URL(base);
    const targetUrl = new URL(url);
    targetUrl.hostname = baseUrl.hostname;
    targetUrl.protocol = baseUrl.protocol;
    return targetUrl.toString();
  } catch {
    return url;
  }
}

export function normalizeImageUrl(imageUrl: string | undefined | null, fallbackUrl: string): string {
  if (!imageUrl || !imageUrl.trim()) {
    return fallbackUrl;
  }
  
  let imgUrl = imageUrl.trim();
  imgUrl = replaceLocalhostWithBaseHost(imgUrl);
  
  // Если это URL на localhost:9000 (MinIO), заменяем на прокси путь
  if (imgUrl.startsWith('http://localhost:9000/') || imgUrl.startsWith('https://localhost:9000/')) {
    // Заменяем http://localhost:9000 на хост, где доступен MinIO (тот же хост, что и API)
    const updated = replaceLocalhostWithBaseHost(imgUrl);
    if (updated !== imgUrl) {
      return updated;
    }
    // fallback — пробуем через относительный путь (если есть бекенд-прокси /pictures)
    const path = imgUrl.replace(/^https?:\/\/localhost:9000/, '');
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Полный URL (не localhost:9000) - используем как есть
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  
  // Путь начинается с /pictures/ - используем как есть (прокси обработает)
  if (imgUrl.startsWith('/pictures/')) {
    return imgUrl;
  }
  
  // Путь начинается с /static/ - используем как есть (прокси обработает)
  if (imgUrl.startsWith('/static/')) {
    return imgUrl;
  }
  
  // Путь начинается с /api/ - используем как есть (прокси обработает)
  if (imgUrl.startsWith('/api/')) {
    return imgUrl;
  }
  
  // Абсолютный путь от корня (но не /static/, /api/, /pictures/) - добавляем /static/
  if (imgUrl.startsWith('/')) {
    return `/static${imgUrl}`;
  }
  
  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    if (imgUrl.includes('/')) {
      return `${cleanBaseUrl}${imgUrl.startsWith('/') ? imgUrl : '/' + imgUrl}`;
    }
    return `${cleanBaseUrl}/static/${imgUrl}`;
  }

  // Относительный путь (просто имя файла) - добавляем /static/
  return `/static/${imgUrl}`;
}

function normalizeDay(input: any): Day {
  // Логируем сырые данные для отладки
  if (input && (input.image_url || input.ImageUrl || input.image || input.Image)) {
    console.log('normalizeDay input image fields:', {
      image_url: input.image_url,
      ImageUrl: input.ImageUrl,
      image: input.image,
      Image: input.Image
    });
  }
  
  // Получаем image_url из разных возможных полей
  const imageUrl = input.image_url ?? input.ImageUrl ?? input.image ?? input.Image ?? '';
  
  return {
    id: input.id ?? input.ID ?? 0,
    name: input.name ?? input.Name ?? input.date ?? input.Date ?? '',
    date: input.date ?? input.Date ?? input.name ?? input.Name ?? '',
    description: input.description ?? input.Description ?? input.fullInfo ?? input.FullInfo ?? '',
    fullInfo: input.fullInfo ?? input.FullInfo ?? input.description ?? input.Description ?? '',
    image_url: imageUrl,
    earthRA: input.earthRA ?? input.EarthRA,
    earthDEC: input.earthDEC ?? input.EarthDEC,
    bodiesText: input.bodiesText ?? input.BodiesText,
    asteroidRA: input.asteroidRA ?? input.AsteroidRA,
    asteroidDEC: input.asteroidDEC ?? input.AsteroidDEC,
  };
}

export async function fetchDays(name?: string): Promise<Day[]> {
  const path = name
    ? `/api/days?name=${encodeURIComponent(name)}`
    : '/api/days';
  const url = withApiBase(path);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch days: ${response.statusText}`);
    }

    const data = await response.json();
    const days = Array.isArray(data) ? data : (data.items || []);
    
    // Если API вернул пустой массив - возвращаем пустой массив (данных нет в БД)
    // НЕ возвращаем mock данные, если API доступен и вернул пустой результат
    if (!days || days.length === 0) {
      console.log('API returned empty result, no data found');
      return [];
    }
    
    const normalizedDays = days.map(normalizeDay);
    // Логирование для отладки
    if (normalizedDays.length > 0) {
      console.log('Fetched days from API:', normalizedDays.map((d: Day) => ({ id: d.id, name: d.name, image_url: d.image_url })));
      console.log('Raw API response sample:', data[0]);
    }
    return normalizedDays;
  } catch (e) {
    // При ошибке подключения к API возвращаем mock данные (fallback)
    // Только если это веб-версия или если в Tauri API был настроен, но недоступен
    console.warn('API request failed, using mock data as fallback:', e);
    const q = (name || '').toLowerCase();
    return MOCK.filter(d => (d.name || d.date || '').toLowerCase().includes(q));
  }
}

export async function fetchDayById(id: number): Promise<Day> {
  try {
    const response = await fetch(withApiBase(`/api/days/${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch day: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeDay(data);
  } catch (e) {
    // При ошибке возвращаем мок данные
    console.warn('API request failed, using mock data:', e);
    const mockDay = MOCK.find(m => m.id === id);
    if (mockDay) {
      return mockDay;
    }
    throw new Error(`Day with id ${id} not found`);
  }
}

// API методы для корзины
export interface CartInfo {
  asteroidRequestId: number;
  counter: number;
}

export async function getCartInfo(): Promise<CartInfo | null> {
  // Основная логика корзины реализована через redux-thunk и AsteroidObservationsService.
  // Функция оставлена для совместимости, но больше не используется.
  return null;
}

// Функция для добавления в корзину (используется в компоненте)
// Теперь используем REST API /api/days/{id}/add-to-draft через сгенерированный DaysService.
export async function addToCart(dayId: number): Promise<boolean> {
  const { DaysService } = await import('./generated');
  await DaysService.postApiDaysAddToDraft({ id: dayId });
  return true;
}
