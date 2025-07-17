import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { getCurrentUser, logout } from './api/authService';
import { getAvatarColor } from './utils/avatar';

import Header from './pages/Header';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [user, setUser] = useState<string | null>(getCurrentUser());

  const handleLogin = (u: string) => setUser(u);
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // ─── NEW: Lifted, shared search state ─────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'country'>('title');
  // ────────────────────────────────────────────────────────────────

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Use our new styled header */}
        <Header
          username={user}
          onLogout={handleLogout}

          // ─── NEW: Pass search props down ───────────────────
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          // ────────────────────────────────────────────────────
        />

        <main style={{ padding: 20 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  username={user ?? undefined}

                  // ─── NEW: Provide search props to Home ───────
                  searchTerm={searchTerm}
                  searchType={searchType}
                  // ───────────────────────────────────────────────
                />
              }
            />

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

            <Route path="/profile/:username" element={<Profile />} />

            <Route
              path="/chat/:withUser"
              element={
                user ? (
                  <ChatPage currentUser={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/login"
              element={
                user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
              }
            />

            <Route
              path="/register"
              element={
                user ? <Navigate to="/" replace /> : <Register />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}
