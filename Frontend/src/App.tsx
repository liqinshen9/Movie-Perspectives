import { useEffect, useState } from 'react';
import type { Movie }           from './models/Movie';
import { getAllMovies }         from './api/movieService';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    getAllMovies().then(setMovies).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Movie Gallery</h1>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {movies.map(m => (
          <div key={m.id} style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
            {m.photoUrl && (
              <img
                src={m.photoUrl}
                alt={m.title}
                style={{ width: '100%', height: 300, objectFit: 'cover' }}
                onError={e => (e.target as HTMLImageElement).src = '/fallback-poster.jpg'}
              />
            )}
            <div style={{ padding: 10 }}>
              <h3>{m.title}</h3>
              <p style={{ color: '#555' }}>{m.introduction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}