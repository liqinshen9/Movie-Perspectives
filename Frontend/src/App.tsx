import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home        from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';

export default function App() {
  const [user, setUser] = useState<string|null>(() => localStorage.getItem('username'));

  const handleLogin = (u:string) => {
    localStorage.setItem('username', u);
    setUser(u);
  };
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <header style={{ padding:20, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between' }}>
        <h1>🎬 Movie Perspectives</h1>
        <nav>
          <Link to="/">Home</Link>&nbsp;
          {user
            ? <>
                Hello, {user}!&nbsp;
                <button onClick={handleLogout}>Logout</button>
              </>
            : <>
                <Link to="/login">Login</Link>&nbsp;
                <Link to="/register">Register</Link>
              </>
          }
        </nav>
      </header>
      <main style={{ padding:20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={
            user
              ? <MovieDetail username={user} />
              : <Navigate to="/login" replace />
          }/>
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin}/>
          }/>
          <Route path="/register" element={
            user ? <Navigate to="/" replace /> : <Register/>
          }/>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
