import type { Review } from './Review';

export interface Movie {
  id: number;
  title: string;
  photoUrl: string;
  introduction: string;
  reviews?: Review[];
}
