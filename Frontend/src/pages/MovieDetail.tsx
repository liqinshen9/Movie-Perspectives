import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../api/movieService';
import {
  getAllReviews,
  postReview,
  deleteReview
} from '../api/reviewService';
import { getCurrentUser } from '../api/authService';
import type { Movie } from '../models/Movie';
import type { Review } from '../models/Review';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const [movie, setMovie]     = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating]   = useState<number>(5);
  const [text, setText]       = useState<string>('');
  const user = getCurrentUser();

  // load movie & its reviews
  useEffect(() => {
    if (!movieId) return;
    getMovieById(movieId)
      .then(m => setMovie(m))
      .catch(console.error);

    getAllReviews(movieId)
      .then(setReviews)
      .catch(console.error);
  }, [movieId]);

  // submit new review
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in first.');
      return;
    }

    await postReview({ movieId, rating, text, username: user });
    // refresh the list so the just-submitted review appears
    const updated = await getAllReviews(movieId);
    setReviews(updated);

    // clear form
    setRating(5);
    setText('');
  };

  // delete a review (only author)
  const handleDelete = async (revId: number, author: string) => {
    if (author !== user) return;
    await deleteReview(revId, user!);
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
            <strong>{r.username}</strong> — {r.rating}⭐
            <p>{r.text}</p>
            {r.username === user && (
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
                <option key={n} value={n}>{n}⭐</option>
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
          <button type="submit" style={{ marginTop: 12 }}>Submit</button>
        </form>
      </section>
    </div>
  );
}
