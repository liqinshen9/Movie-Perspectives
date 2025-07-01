// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../models/Movie';
import { getAllMovies } from '../api/movieService';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    getAllMovies().then(setMovies).catch(console.error);
  }, []);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
      {movies.map(m => (
        <Link key={m.id} to={`/movies/${m.id}`} style={{ textDecoration:'none', color:'inherit' }}>
          <img src={m.photoUrl} alt={m.title} style={{ width:'100%', borderRadius:8 }} />
          <h3>{m.title}</h3>
          <p>{m.introduction.slice(0,60)}…</p>
        </Link>
      ))}
    </div>
  );
}
