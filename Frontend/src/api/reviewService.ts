// src/api/reviewService.ts
import type { Review } from "../models/Review";

export async function getAllReviews(movieId: number): Promise<Review[]> {
  const resp = await fetch(`/api/review/movie/${movieId}`);
  if (!resp.ok) throw new Error(resp.statusText);
  return resp.json();
}

export async function addReview(
  movieId: number,
  review: Omit<Review, "id">
): Promise<Review> {
  const resp = await fetch(`/api/review/movie/${movieId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!resp.ok) throw new Error(resp.statusText);
  return resp.json();
}
export async function deleteReview(reviewId: number): Promise<void> {
  const resp = await fetch(`/api/review/${reviewId}`, {
    method: "DELETE",
  });
  if (!resp.ok) throw new Error(resp.statusText);
}