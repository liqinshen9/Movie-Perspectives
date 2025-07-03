import React, { useState } from 'react';
import { login }       from '../api/authService';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }: { onLogin: (u: string) => void }) {
  const [u, setU] = useState(''),
        [p, setP] = useState('');
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(u, p);
      onLogin(u);
      nav('/');
    } catch {
      alert('Invalid credentials or unregistered');
    }
  };

  return (
    <div className="page-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Login</h2>
        <input
          placeholder="Username"
          value={u}
          onChange={e => setU(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={p}
          onChange={e => setP(e.target.value)}
        />
        <button type="submit">Login</button>
        <div className="link-row">
          <span>Need an account? </span>
          <a href="/register">Register</a>
        </div>
      </form>
    </div>
  );
}
