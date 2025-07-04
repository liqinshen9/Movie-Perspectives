export interface Review {
  id: number
  movieId: number
  username: string
  rating: number
  text: string
  /** optional timestamp from server */
  reviewDate?: string
  /** top‐level reviews will have null here */
  parentId?: number | null
}
