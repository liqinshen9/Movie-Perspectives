import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams }   from 'react-router-dom';
import { getMovieById } from '../api/movieService';
import {
  getAllReviews,
  postReview,
  deleteReview
} from '../api/reviewService';
import type { Movie }  from '../models/Movie';
import type { Review } from '../models/Review';

interface MovieDetailProps {
  username: string;
}

export default function MovieDetail({ username }: MovieDetailProps) {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const [movie, setMovie]     = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating]   = useState<number>(5);
  const [text, setText]       = useState<string>('');

  useEffect(() => {
    if (!movieId) return;
    getMovieById(movieId).then(setMovie).catch(console.error);
    getAllReviews(movieId).then(setReviews).catch(console.error);
  }, [movieId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // now we trust `username` always exists
    await postReview({ movieId, rating, text, username });
    const updated = await getAllReviews(movieId);
    setReviews(updated);
    setRating(5);
    setText('');
  };

  const handleDelete = async (revId: number, author: string) => {
    if (author !== username) return;
    await deleteReview(revId, username);
    setReviews(await getAllReviews(movieId));
  };

  if (!movie) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>{movie.title}</h1>
      <img
        src={movie.photoUrl}
        alt={movie.title}
        style={{ width: '100%', borderRadius: 8 }}
      />
      <p>{movie.introduction}</p>

      <section>
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map(r => (
          <div
            key={r.id}
            style={{
              border: '1px solid #ccc',
              padding: 8,
              marginBottom: 8,
              borderRadius: 4
            }}
          >
            <strong>{r.username}</strong> —{' '}
            <span style={{ color: '#f5a623' }}>{'★'.repeat(r.rating)}</span>
            <p>{r.text}</p>
            {r.username === username && (
              <button
                style={{ color: 'red' }}
                onClick={() => handleDelete(r.id, r.username)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </section>

      <section>
        <h2>Leave a review</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:{' '}
            <select
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>
                  {'★'.repeat(n)}
                </option>
              ))}
            </select>
          </label>

          <div style={{ marginTop: 8 }}>
            <label>
              Comment:
              <br />
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                style={{ width: '100%' }}
              />
            </label>
          </div>

          <button type="submit" style={{ marginTop: 12 }}>
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
