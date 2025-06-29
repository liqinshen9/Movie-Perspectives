import axios from 'axios';
import type { Movie } from '../models/Movie';

export const getAllMovies = () =>
  axios.get<Movie[]>('/api/Movie').then(res => res.data);