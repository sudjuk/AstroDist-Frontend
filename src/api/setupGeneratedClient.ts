import { OpenAPI } from './generated';

const baseEnv = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
OpenAPI.BASE = baseEnv || '';
OpenAPI.WITH_CREDENTIALS = false;

OpenAPI.TOKEN = async () => {
  const token = localStorage.getItem('auth_token');
  return token ?? '';
};








