import axios from 'axios'

export function register(username: string, password: string) {
  return axios.post('/api/auth/register', { username, password })
}

export function login(username: string, password: string) {
  return axios.post('/api/auth/login', { username, password })
}
export function getCurrentUser(): string | null {
  return localStorage.getItem('username');
}