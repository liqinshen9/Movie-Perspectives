import { useEffect, useState } from 'react';
import { getAllMovies } from '../api/movieService';
import type { Movie }           from '../models/Movie';
import { Link } from 'react-router-dom';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => { getAllMovies().then(setMovies); }, []);
  return (
    <div>
      <h2>All Movies</h2>
      <ul>
        {movies.map(m => (
          <li key={m.id}>
            <Link to={`/movies/${m.id}`}>{m.title || '(untitled)'}</Link>
          </li>
        ))}
        {movies.length === 0 && <li>No movies yet</li>}
      </ul>
    </div>
  );
}
