// src/api/authService.ts
import axios from 'axios';

export async function login(username: string, password: string): Promise<string> {
  const { data } = await axios.post('/api/auth/login', { username, password });
  localStorage.setItem('token', data.token);
  return data.username;
}

export async function register(username: string, password: string): Promise<string> {
  const { data } = await axios.post('/api/auth/register', { username, password });
  localStorage.setItem('token', data.token);
  return data.username;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getCurrentUser(): Promise<string> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.sub;
}

// automatically attach JWT to all axios calls
axios.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers!['Authorization'] = `Bearer ${t}`;
  return cfg;
});
