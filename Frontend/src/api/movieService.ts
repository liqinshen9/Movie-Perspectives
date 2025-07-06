import type { Movie }  from '../models/Movie';
import type { Review } from '../models/Review';

export async function getAllMovies(): Promise<Movie[]> {
  const resp = await fetch('/api/movie');
  if (!resp.ok) throw new Error(resp.statusText);
  return resp.json();
}

export async function getMovieById(id: number): Promise<Movie> {
  const resp = await fetch(`/api/movie/${id}`);
  if (!resp.ok) throw new Error(resp.statusText);
  return resp.json();
}

export async function addReview(
  movieId: number,
  review: Omit<Review, 'id'>
): Promise<void> {
  const resp = await fetch(`/api/movie/${movieId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!resp.ok) throw new Error(resp.statusText);
}
