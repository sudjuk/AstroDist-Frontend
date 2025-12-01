import axios from 'axios';

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

export const api = axios.create({
  baseURL: baseUrl || undefined,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


