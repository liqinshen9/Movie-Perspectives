import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MovieDetail from './MovieDetail'
import { getMovieById } from '../api/movieService'
import { getAllReviews, postReview, deleteReview } from '../api/reviewService'
import type { Movie } from '../models/Movie'
import type { Review } from '../models/Review'

vi.mock('../api/movieService', () => ({ getMovieById: vi.fn() }))
vi.mock('../api/reviewService', () => ({
  getAllReviews: vi.fn(),
  postReview: vi.fn(),
  deleteReview: vi.fn()
}))

describe('MovieDetail Component', () => {
  const movie: Movie = {
    id: 1,
    title: 'Test Movie',
    photoUrl: 'http://example.com/poster.jpg',
    introduction: 'An exciting test movie'
  }

  beforeEach(() => {
    vi.mocked(getMovieById).mockResolvedValue(movie)
    vi.mocked(getAllReviews).mockResolvedValue([])
    vi.mocked(postReview).mockResolvedValue(undefined)
    vi.mocked(deleteReview).mockResolvedValue(undefined)
  })

  function renderWithRoute(user = 'user') {
    return render(
      <MemoryRouter initialEntries={['/movies/1']}>
        <Routes>
          <Route path="/movies/:id" element={<MovieDetail username={user} />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('shows loading then movie details', async () => {
    renderWithRoute()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(await screen.findByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('An exciting test movie')).toBeInTheDocument()
  })

  it('displays no reviews message if none exist', async () => {
    renderWithRoute()
    await screen.findByText('Test Movie')
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument()
  })

  it('submits a new review', async () => {
    renderWithRoute()
    await screen.findByText('Test Movie')
    fireEvent.change(screen.getByPlaceholderText('Please leave a review'), {
      target: { value: 'Great film!' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(postReview).toHaveBeenCalledWith({
        movieId: 1,
        rating: 5,
        text: 'Great film!',
        username: 'user'
      })
    })
  })

  it('allows deleting a review authored by current user', async () => {
    const review: Review = {
      id: 10,
      movieId: 1,
      username: 'user',
      text: 'Nice',
      rating: 4,
      reviewDate: new Date().toISOString(),
      parentId: null
    }
    vi.mocked(getAllReviews).mockResolvedValueOnce([review])
    renderWithRoute()
    expect(await screen.findByText('Nice')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() => {
      expect(deleteReview).toHaveBeenCalledWith(10, 'user')
    })
  })
})
