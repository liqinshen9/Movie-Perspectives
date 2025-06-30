// src/pages/Register.tsx
import React, { useState } from 'react';
import { register }    from '../api/authService';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegister: (username: string) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await register(u, p);
      onRegister(user);
      nav('/');
    } catch {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 300 }}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={u}
        onChange={e => setU(e.target.value)}
        required
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={p}
        onChange={e => setP(e.target.value)}
        required
      /><br/>
      <button type="submit">Register</button>
    </form>
  );
}
