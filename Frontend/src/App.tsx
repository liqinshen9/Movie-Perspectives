// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';

export default function App() {
  const [username, setUsername] = useState<string | null>(
    () => localStorage.getItem('username')
  );
  const handleLogin = (u: string) => {
    localStorage.setItem('username', u);
    setUsername(u);
  };
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
  };

  return (
    <BrowserRouter>
      <header style={{ padding: 20, borderBottom: '1px solid #eee', display:'flex', justifyContent:'space-between'}}>
        <h1>🎬 Movie Perspectives</h1>
        <nav>
          <Link to="/" style={{ marginRight: 12 }}>Home</Link>
          {username ? (
            <>
              <span style={{ marginRight: 12 }}>Hello, {username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/movies/:id"
            element={
              username
                ? <MovieDetail />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={
              username
                ? <Navigate to="/" replace />
                : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              username
                ? <Navigate to="/" replace />
                : <Register />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
