import React, { useState } from 'react';
import { register }    from '../api/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [u, setU] = useState(''),
        [p, setP] = useState('');
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(u, p);
      alert('Registered! Please log in.');
      nav('/login');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="page-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Register</h2>
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
        <button type="submit">Register</button>
        <div className="link-row">
          <span>Have one already? </span>
          <a href="/login">Log in</a>
        </div>
      </form>
    </div>
  );
}
