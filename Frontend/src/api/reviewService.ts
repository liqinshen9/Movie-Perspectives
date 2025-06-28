import axios from 'axios';
import type { Review } from '../models/Review';

const client = axios.create({ baseURL: 'http://localhost:5077' });

export function getReviews(movieId: number) {
  return client.get<Review[]>(`/api/Review?movieId=${movieId}`)
               .then(r => r.data);
}
export function addReview(r: Omit<Review,'id'>) {
  return client.post<Review>('/api/Review', r).then(r => r.data);
}
