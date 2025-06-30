// src/api/reviewService.ts
import axios from 'axios';
import type { Review } from '../models/Review';

export async function getReviews(movieId:number):Promise<Review[]> {
  const { data } = await axios.get<Review[]>(`/api/movies/${movieId}/reviews`);
  return data;
}

export async function postReview(
  movieId:number,
  review: { content:string; rating:number }
):Promise<Review> {
  const { data } = await axios.post<Review>(
    `/api/movies/${movieId}/reviews`,
    review
  );
  return data;
}
