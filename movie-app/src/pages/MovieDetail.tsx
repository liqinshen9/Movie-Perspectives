import React, { useEffect, useState } from 'react';
import { useParams }                  from 'react-router-dom';
import { getAllMovies }               from '../api/movieService';
import type { Movie }                 from '../models/Movie';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!id) return;
    getAllMovies()
      .then(arr => setMovie(arr.find(m => m.id === +id) ?? null))
      .catch(console.error);
  }, [id]);

  if (!movie) return <div>Loading…</div>;
  return (
    <div>
      <h2>{movie.title}</h2>
      <p>Release Date: {new Date(movie.release).toLocaleDateString()}</p>
    </div>
  );
}
