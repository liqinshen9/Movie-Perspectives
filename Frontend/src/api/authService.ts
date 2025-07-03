// reads + writes to localStorage under the hood
export function login(username: string, password: string) {
  return fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => {
    if (!res.ok) throw new Error('Invalid credentials');
    localStorage.setItem('user', username);
  });
}

export function register(username: string, password: string) {
  return fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => {
    if (!res.ok) throw new Error('Registration failed');
  });
}

export function logout() {
  localStorage.removeItem('user');
}

export function getCurrentUser(): string | null {
  return localStorage.getItem('user');
}
