// src/App.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home        from './pages/Home';
import NewMovie    from './pages/NewMovie';
import MovieDetail from './pages/MovieDetail';

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link> | <Link to="/new">Add Movie</Link>
      </nav>
      <Routes>
        <Route path="/"           element={<Home />}        />
        <Route path="/new"        element={<NewMovie />}    />
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
    </div>
  );
}
