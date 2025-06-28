import axios from 'axios';
import type { Movie } from '../models/Movie';

// If you configured a Vite proxy, baseURL can be ''
const client = axios.create({ baseURL: 'http://localhost:5077' });

export async function getAllMovies(): Promise<Movie[]> {
  const { data } = await client.get<Movie[]>('/api/Movie');
  return data;
}

export async function createMovie(m: Omit<Movie,'id'>): Promise<Movie> {
  const { data } = await client.post<Movie>('/api/Movie', m);
  return data;
}

