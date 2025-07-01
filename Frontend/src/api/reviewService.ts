// src/api/reviewService.ts
import type { Review } from '../models/Review';

export async function getAllReviews(movieId: number): Promise<Review[]> {
  const resp = await fetch(`/api/review/movie/${movieId}`);
  if (!resp.ok) throw new Error(resp.statusText);
  return resp.json();
}

export async function postReview(review: Omit<Review, 'id'>): Promise<void> {
  const resp = await fetch('/api/review', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(review),
  });
  if (!resp.ok) throw new Error(resp.statusText);
}

export async function deleteReview(id: number, username: string): Promise<void> {
  const resp = await fetch(`/api/review/${id}?user=${encodeURIComponent(username)}`, {
    method: 'DELETE'
  });
  if (!resp.ok) throw new Error(resp.statusText);
}
