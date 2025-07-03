import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';

import Home        from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';
import { getCurrentUser, logout } from './api/authService';

export default function App() {
  const [user, setUser] = useState<string | null>(getCurrentUser());

  const handleLogin = (username: string) => setUser(username);
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <header style={{
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
      }}>
        <h1 style={{ margin: 0 }}>🎬 Movie Perspectives</h1>
        <nav>
          <Link to="/" style={{ marginRight: 12 }}>Home</Link>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hello, {user}</span>
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
          <Route
            path="/"
            element={user
              ? <Home />
              : <Navigate to="/login" replace />}
          />

          <Route
            path="/movies/:id"
            element={user
              ? <MovieDetail username={user} />
              : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={user
              ? <Navigate to="/" replace />
              : <Login onLogin={handleLogin} />}
          />

          <Route
            path="/register"
            element={user
              ? <Navigate to="/" replace />
              : <Register />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
