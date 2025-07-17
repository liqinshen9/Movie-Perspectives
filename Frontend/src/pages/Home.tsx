// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../models/Movie';
import { getAllMovies } from '../api/movieService';
import './Home.css';

interface HomeProps {
  username?: string;
  searchTerm: string;
  searchType: 'all' | 'title' | 'country';
}

export default function Home({
  username,
  searchTerm,
  searchType,
}: HomeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;
  const navigate = useNavigate();

  // ─── NEW: whenever the user clears or changes filter, jump back to page 1 ───
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchType]);
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    getAllMovies().then(setMovies).catch(console.error);
  }, []);

  const countrySynonyms: Record<string, string[]> = {
    us: ['us', 'usa', 'america', 'american'],
    uk: ['uk', 'britain', 'british', 'united kingdom'],
    korea: ['korea','south korea','south korean','korean','koreea','korena'],
    japan: ['japan','japanese','japn','japnaese','japnaes','japanee'],
    china: ['chinese'],
    france: ['french','frence'],
    russia: ['russian'],
    spanish: ['spain','spanish']
  };

  const canonicalCountry = (raw: string) => {
    const s = raw.trim().toLowerCase();
    for (const [canon, variants] of Object.entries(countrySynonyms)) {
      if (variants.includes(s)) return canon;
    }
    return s;
  };

  const norm = searchTerm.trim().toLowerCase();

  // build the full filtered list
  let filteredAll: Movie[];
  if (searchType === 'all') {
    filteredAll = norm
      ? movies.filter(m =>
          m.title.toLowerCase().includes(norm) ||
          canonicalCountry(m.country ?? '').includes(canonicalCountry(searchTerm))
        )
      : movies;
  } else if (!norm) {
    // default “Most popular” six
    filteredAll = movies.slice(0, 6);
  } else if (searchType === 'title') {
    filteredAll = movies.filter(m =>
      m.title.toLowerCase().includes(norm)
    );
  } else {
    const termCanon = canonicalCountry(searchTerm);
    filteredAll = movies.filter(m =>
      canonicalCountry(m.country ?? '') === termCanon
    );
  }

  // pagination logic
  const lastIdx = currentPage * moviesPerPage;
  const firstIdx = lastIdx - moviesPerPage;
  const currentMovies = filteredAll.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filteredAll.length / moviesPerPage);

  const goTo = (id: number) => {
    if (username) navigate(`/movies/${id}`);
    else navigate('/login');
  };

  const headingText = !norm && searchType !== 'all'
    ? 'Most popular movies'
    : searchType === 'country'
      ? `Movies from ${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)}`
      : searchType === 'all' && !norm
        ? 'All Movies'
        : `Search results for "${searchTerm}"`;

  return (
    <div className="home-page">
      <h2 className="home-title">{headingText}</h2>

      <div className="home-grid">
        {currentMovies.map(m => (
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
            <img src={m.photoUrl} alt={m.title} className="movie-poster" />
            <h3>{m.title}</h3>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
