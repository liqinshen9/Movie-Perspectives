// src/App.tsx
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

import Home        from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Profile     from './pages/Profile';    // ← new
import { getCurrentUser, logout } from './api/authService';

export default function App() {
  const [user, setUser] = useState<string | null>(getCurrentUser());

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Capital letter for avatar
  const avatarLetter = user ? user.charAt(0).toUpperCase() : '';

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
            <Link to="/" style={{ marginRight: 12 }}>Home</Link>

            {user ? (
              <>
                <span style={{ marginRight: 12 }}>Hello, {user}</span>

                {/* avatar link */}
                <Link
                  to={`/profile/${user}`}
                  style={{
                    display: 'inline-block',
                    width: 32,
                    height: 32,
                    lineHeight: '32px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    backgroundColor: '#3498db',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginRight: 12,
                  }}
                >
                  {avatarLetter}
                </Link>

                <button onClick={handleLogout} style={{ marginRight: 12 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ marginRight: 12 }}>Login</Link>
                <Link to="/register" style={{ marginRight: 12 }}>Register</Link>
              </>
            )}

            {/* Theme toggle */}
            <ThemeToggle />
          </nav>
        </header>

        <main style={{ padding: 20 }}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home username={user ?? undefined} />} />

            {/* Movie details (requires login) */}
            <Route
              path="/movies/:id"
              element={
                user
                  ? <MovieDetail username={user} />
                  : <Navigate to="/login" replace />
              }
            />

            {/* Profile page */}
            <Route path="/profile/:username" element={<Profile />} />

            {/* Login */}
            <Route
              path="/login"
              element={
                user
                  ? <Navigate to="/" replace />
                  : <Login onLogin={handleLogin} />
              }
            />

            {/* Register */}
            <Route
              path="/register"
              element={
                user
                  ? <Navigate to="/" replace />
                  : <Register />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}

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
