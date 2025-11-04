const API_PREFIX = '/api';

export interface DayDTO {
  id: number;
  date: string;
  fullInfo: string;
  image?: string;
  earthRA?: number;
  earthDEC?: number;
  bodiesText?: string;
  asteroidRA?: number;
  asteroidDEC?: number;
}

const MOCK: DayDTO[] = [
  { id: 1, date: 'Mock Day 1', fullInfo: 'Описание дня 1 (mock).', image: '' },
  { id: 2, date: 'Mock Day 2', fullInfo: 'Описание дня 2 (mock).', image: '' },
  { id: 3, date: 'Mock Day 3', fullInfo: 'Описание дня 3 (mock).', image: '' },
];

function normalizeDay(input: any): DayDTO {
  // Accept both our camelCase and backend PascalCase keys
  return {
    id: input.id ?? input.ID,
    date: input.date ?? input.Date ?? '',
    fullInfo: input.fullInfo ?? input.FullInfo ?? '',
    image: input.image ?? input.Image ?? '',
    earthRA: input.earthRA ?? input.EarthRA,
    earthDEC: input.earthDEC ?? input.EarthDEC,
    bodiesText: input.bodiesText ?? input.BodiesText,
    asteroidRA: input.asteroidRA ?? input.AsteroidRA,
    asteroidDEC: input.asteroidDEC ?? input.AsteroidDEC,
  };
}

export async function getServices(name?: string): Promise<DayDTO[]> {
  const url = name && name.trim().length > 0 ? `${API_PREFIX}/days?name=${encodeURIComponent(name)}` : `${API_PREFIX}/days`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items;
    if (!items) return [];
    return items.map(normalizeDay);
  } catch (e) {
    const q = (name || '').toLowerCase();
    return MOCK.filter(d => d.date.toLowerCase().includes(q));
  }
}

export async function getServiceById(id?: string): Promise<DayDTO | null> {
  if (!id) return null;
  try {
    const res = await fetch(`${API_PREFIX}/days/${id}`);
    if (!res.ok) throw new Error('bad status');
    const raw = await res.json();
    return normalizeDay(raw);
  } catch (e) {
    const num = parseInt(id, 10);
    return MOCK.find(m => m.id === num) || null;
  }
}


