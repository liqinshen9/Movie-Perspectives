// src/App.tsx
import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

import Home        from './pages/Home';
import Login       from './pages/Login';
import Register    from './pages/Register';
import MovieDetail from './pages/MovieDetail';

export default function App() {
  // null = not logged in; otherwise holds the username
  const [user, setUser] = useState<string | null>(null);

  const handleLogin  = (username: string) => setUser(username);
  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      {/* header/nav */}
      <header style={{
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
      }}>
        <h1 style={{ margin: 0 }}>🎥 Movie Perspectives</h1>
        <nav>
          <Link to="/"      style={{ marginRight: 12 }}>Home</Link>

          {user
            ? <>
                <span style={{ marginRight: 12 }}>Hello, {user}</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            : <>
                <Link to="/login"    style={{ marginRight: 12 }}>Login</Link>
                <Link to="/register">Register</Link>
              </>
          }
        </nav>
      </header>

      <main style={{ padding: 20 }}>
        <Routes>
          {/* public home */}
          <Route path="/" element={<Home />} />

          {/* login/register */}
          <Route
            path="/login"
            element={
              user
                ? <Navigate to="/" replace />
                : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              user
                ? <Navigate to="/" replace />
                : <Register onRegister={handleLogin} />
            }
          />

          {/* protected movie detail */}
          <Route
            path="/movies/:id"
            element={
              user
                ? <MovieDetail />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
