// src/App.tsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

import Home        from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';
import { getCurrentUser, logout } from './api/authService';

export default function App() {
  // initial user comes from your authService (e.g. localStorage)
  const [user, setUser] = useState<string | null>(getCurrentUser());

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <header
          style={{
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
          }}
        >
          <h1 style={{ margin: 0 }}>🎬 Movie Perspectives</h1>
          <nav style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ marginRight: 12 }}>
              Home
            </Link>

            {user ? (
              <>
                <span style={{ marginRight: 12 }}>Hello, {user}</span>
                <button onClick={handleLogout} style={{ marginRight: 12 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ marginRight: 12 }}>
                  Login
                </Link>
                <Link to="/register" style={{ marginRight: 12 }}>
                  Register
                </Link>
              </>
            )}

            {/*  ─── THEME TOGGLE ───  */}
            <ThemeToggle />
          </nav>
        </header>

        <main style={{ padding: 20 }}>
          <Routes>
            {/* Home is public */}
            <Route
              path="/"
              element={<Home username={user ?? undefined} />}
            />

            {/* Movie details + review require login */}
            <Route
              path="/movies/:id"
              element={
                user ? (
                  <MovieDetail username={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Login page */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            {/* Register page (no onRegister prop) */}
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register />
                )
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// A tiny component to avoid cluttering the header above:
function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button
      onClick={toggle}
      aria-label="Toggle light/dark mode"
      style={{
        background: 'none',
        border: 'none',
        fontSize: '1.25rem',
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
