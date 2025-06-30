import axios from 'axios';
import type { Movie } from '../models/Movie';

export function getAllMovies(): Promise<Movie[]> {
  return axios.get('/api/movie').then(res => res.data);
}

export async function getMovieById(id: number): Promise<Movie> {
  const { data } = await axios.get<Movie>(`/api/movie/${id}`);
  return data;
}
