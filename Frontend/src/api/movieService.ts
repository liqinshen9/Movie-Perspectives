import axios from 'axios';
import type { Movie } from '../models/Movie';

export function getAllMovies(): Promise<Movie[]> {
  return axios.get('/api/movie').then(res => res.data);
}
