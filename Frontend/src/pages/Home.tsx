import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { getAllMovies }        from '../api/movieService'; 
import type { Movie }          from '../models/Movie';  

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getAllMovies()
      .then(setMovies)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Movie Gallery</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {movies.length === 0 && <li>No movies yet</li>}
        {movies.map(m => (
          <li
            key={m.id}
            style={{
              marginBottom: 20,
              border: '1px solid #ccc',
              borderRadius: 8,
              overflow: 'hidden',
              maxWidth: 400
            }}
          >
            {m.photoUrl && (
              <img
                src={m.photoUrl}
                alt={m.title}
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
                onError={e => {
                  (e.target as HTMLImageElement).src = '/fallback-poster.jpg';
                }}
              />
            )}
            <div style={{ padding: 10 }}>
              <h3>{m.title}</h3>
              {m.introduction && (
                <p style={{ color: '#555' }}>
                  {m.introduction.length > 100
                    ? m.introduction.slice(0, 100) + '…'
                    : m.introduction}
                </p>
              )}
              <Link to={`/movies/${m.id}`}>Read more & reviews →</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
