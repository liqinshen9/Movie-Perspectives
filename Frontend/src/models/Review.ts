export interface Review {
  id: number
  movieId: number
  username: string
  rating: number
  text: string
  reviewDate?: string
  parentId?: number | null
}
