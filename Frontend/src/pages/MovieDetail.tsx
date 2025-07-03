import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../api/movieService';
import {
  getAllReviews,
  postReview,
  deleteReview
} from '../api/reviewService';
import type { Movie } from '../models/Movie';
import type { Review } from '../models/Review';

import './MovieDetail.css';

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
    await postReview({ movieId, rating, text, username });
    setReviews(await getAllReviews(movieId));
    setRating(5);
    setText('');
  };

  const handleDelete = async (revId: number, author: string) => {
    if (author !== username) return;
    await deleteReview(revId, username);
    setReviews(await getAllReviews(movieId));
  };

  if (!movie) return <p className="loading">Loading…</p>;

  return (
    <div className="movie-detail">
      <h1 className="title">{movie.title}</h1>

      <div className="poster-container">
        <img
          src={movie.photoUrl}
          alt={movie.title}
          className="movie-poster"
        />
      </div>

      <p className="movie-intro">{movie.introduction}</p>

      <section className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        <div className="reviews-list">
          {reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-header">
                <strong>{r.username}</strong>
                <span className="stars">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="review-text">{r.text}</p>
              {r.username === username && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(r.id, r.username)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="review-form-section">
        <h2>Leave a review</h2>
        <form className="review-form" onSubmit={handleSubmit}>
          <label>
            Rating:
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

          <label>
            Comment:
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
            />
          </label>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
