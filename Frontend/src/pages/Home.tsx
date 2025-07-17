import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../models/Movie';
import { getAllMovies } from '../api/movieService';
import './Home.css';

interface HomeProps {
  username?: string;
  searchTerm: string;
  searchType: 'title' | 'country';
}

export default function Home({
  username,
  searchTerm,
  searchType,
}: HomeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMovies().then(setMovies).catch(console.error);
  }, []);

  // country synonyms map
  const countrySynonyms: Record<string, string[]> = {
    us: ['us', 'usa', 'america', 'american'],
    uk: ['uk', 'britain', 'british', 'united kingdom'],
    // add more as needed
  };

  const canonicalCountry = (raw: string) => {
    const s = raw.trim().toLowerCase();
    for (const [canon, variants] of Object.entries(countrySynonyms)) {
      if (variants.includes(s)) return canon;
    }
    return s;
  };

  // filtering logic: show top 6 when no term, otherwise by title or country
  const norm = searchTerm.trim().toLowerCase();

  let filtered: Movie[];
  if (!norm) {
    filtered = movies.slice(0, 6);
  } else if (searchType === 'title') {
    filtered = movies.filter(m =>
      m.title.toLowerCase().includes(norm)
    );
  } else {
    const termCanon = canonicalCountry(searchTerm);
    filtered = movies.filter(m =>
      canonicalCountry(m.country ?? '') === termCanon
    );
  }

  const goTo = (id: number) => {
    if (username) navigate(`/movies/${id}`);
    else navigate('/login');
  };

  const headingText = !norm
    ? 'Most popular movies'
    : searchType === 'country'
    ? `Movies from ${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)}`
    : `Search results for "${searchTerm}"`;

  return (
    <div className="home-page">
      <h2 className="home-title">{headingText}</h2>

      <div className="home-grid">
        {filtered.map(m => (
          <div
            key={m.id}
            className="movie-card"
            onClick={() => goTo(m.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ')
                goTo(m.id);
            }}
          >
            <img
              src={m.photoUrl}
              alt={m.title}
              className="movie-poster"
            />
            <h3>{m.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
