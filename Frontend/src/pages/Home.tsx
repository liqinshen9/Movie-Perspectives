import React, { useEffect, useState } from 'react';
import { getAllMovies }      from '../api/movieService';
import type { Movie }        from '../models/Movie';

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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
        gap: 20,
      }}>
        {movies.map(m => (
          <div key={m.id} style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <img
              src={m.photoUrl}
              alt={m.title}
              style={{ width: '100%', height: 300, objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).src = '/fallback.jpg'; }}
            />
            <div style={{ padding: 10 }}>
              <h3>{m.title}</h3>
              <p style={{ color: '#555' }}>
                {m.introduction?.length > 100
                  ? m.introduction.slice(0,100) + '…'
                  : m.introduction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
