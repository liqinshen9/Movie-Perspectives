// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate }            from 'react-router-dom';
import type { Movie }              from '../models/Movie';
import { getAllMovies }            from '../api/movieService';
import './Home.css';

interface HomeProps {
  username?: string;
}

export default function Home({ username }: HomeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllMovies().then(setMovies).catch(console.error);
  }, []);

  const filteredAll = movies.filter(m =>
    m.title.toLowerCase().includes(search.trim().toLowerCase())
  );
  const filtered = search
    ? filteredAll
    : filteredAll.slice(0, 6);

  const goTo = (id: number) => {
    if (username) navigate(`/movies/${id}`);
    else          navigate('/login');
  };

  return (
    <div className="home-page">
      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="home-grid">
        {filtered.map(m => (
          <div
            key={m.id}
            className="movie-card"
            onClick={() => goTo(m.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') goTo(m.id);
            }}
          >
            <img
              src={m.photoUrl}
              alt={m.title}
              className="movie-poster"
            />
            <h3>{m.title}</h3>
            <p>{m.introduction.slice(0, 60)}…</p>
          </div>
        ))}
      </div>
    </div>
  );
}
