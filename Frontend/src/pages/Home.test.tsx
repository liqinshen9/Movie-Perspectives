import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import type { Movie } from '../models/Movie'

vi.mock('../api/movieService', () => {
  const fakeMovies: Movie[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Movie ${i + 1}`,
    photoUrl: `http://example.com/poster${i + 1}.jpg`,
    introduction: `This is the intro for movie ${i + 1}`
  }))
  return {
    getAllMovies: vi.fn().mockResolvedValue(fakeMovies)
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('renders only the first six movies by default', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(await screen.findByText('Movie 1')).toBeInTheDocument()
    for (let i = 0; i < 6; i++) {
      expect(screen.getByText(`Movie ${i + 1}`)).toBeInTheDocument()
    }
    expect(screen.queryByText('Movie 7')).toBeNull()
    expect(screen.queryByText('Movie 8')).toBeNull()
  })

  it('filters the movie list when typing in the search box', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    await screen.findByText('Movie 1')
    const input = screen.getByPlaceholderText('Search movies...')
    fireEvent.change(input, { target: { value: '7' } })
    await waitFor(() => {
      expect(screen.getByText('Movie 7')).toBeInTheDocument()
      expect(screen.queryByText('Movie 1')).toBeNull()
    })
  })

  it('navigates to /movies/:id when clicked and username is provided', async () => {
    render(
      <MemoryRouter>
        <Home username="alice" />
      </MemoryRouter>
    )
    await screen.findByText('Movie 1')
    fireEvent.click(screen.getByText('Movie 3'))
    expect(mockNavigate).toHaveBeenCalledWith('/movies/3')
  })

  it('navigates to /login when clicked and no username', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    await screen.findByText('Movie 1')
    fireEvent.click(screen.getByText('Movie 4'))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('handles keyboard Enter on focused card the same as click', async () => {
    render(
      <MemoryRouter>
        <Home username="bob" />
      </MemoryRouter>
    )
    await screen.findByText('Movie 1')
    const card = screen
      .getByText('Movie 5')
      .closest('[role="button"]') as HTMLElement
    card.focus()
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/movies/5')
  })
})
