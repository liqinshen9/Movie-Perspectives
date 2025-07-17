import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import type { Movie } from '../models/Movie'

vi.mock('../api/movieService', () => {
  const countries = ['US','US','UK','UK','Japan','Japan','France','France']
  const fakeMovies: Movie[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Movie ${i + 1}`,
    photoUrl: `http://example.com/poster${i + 1}.jpg`,
    introduction: `This is the intro for movie ${i + 1}`,
    country: countries[i],
  }))
  return {
    getAllMovies: vi.fn().mockResolvedValue(fakeMovies),
  }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Home Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('renders only the first six movies by default', async () => {
    const { findByText, queryByText } = render(
      <MemoryRouter>
        <Home searchTerm="" searchType="title" />
      </MemoryRouter>
    )
    expect(await findByText('Movie 1')).toBeInTheDocument()
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Movie ${i}`)).toBeInTheDocument()
    }
    expect(queryByText('Movie 7')).toBeNull()
    expect(queryByText('Movie 8')).toBeNull()
  })

  it('filters the movie list when searchTerm prop changes', async () => {
    const { findByText, rerender, queryByText } = render(
      <MemoryRouter>
        <Home searchTerm="" searchType="title" />
      </MemoryRouter>
    )
    expect(await findByText('Movie 1')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <Home searchTerm="7" searchType="title" />
      </MemoryRouter>
    )

    expect(await screen.findByText('Movie 7')).toBeInTheDocument()
    expect(queryByText('Movie 1')).toBeNull()
  })

  it('filters by country code and variants', async () => {
    const { findByText, rerender, queryByText } = render(
      <MemoryRouter>
        <Home searchTerm="" searchType="country" />
      </MemoryRouter>
    )
    expect(await findByText('Movie 1')).toBeInTheDocument()

  
    rerender(
      <MemoryRouter>
        <Home searchTerm="british" searchType="country" />
      </MemoryRouter>
    )
  
    expect(screen.getByText('Movie 3')).toBeInTheDocument()
    expect(screen.getByText('Movie 4')).toBeInTheDocument()
    expect(queryByText('Movie 1')).toBeNull()

    rerender(
      <MemoryRouter>
        <Home searchTerm="america" searchType="country" />
      </MemoryRouter>
    )
    expect(screen.getByText('Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Movie 2')).toBeInTheDocument()
    expect(queryByText('Movie 3')).toBeNull()
  })

  it('displays the correct heading when searching by country', async () => {
    const { findByText, rerender } = render(
      <MemoryRouter>
        <Home searchTerm="" searchType="country" />
      </MemoryRouter>
    )
    expect(await findByText('Most popular movies')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <Home searchTerm="japan" searchType="country" />
      </MemoryRouter>
    )
    expect(screen.getByText('Movies from Japan')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <Home searchTerm="uk" searchType="country" />
      </MemoryRouter>
    )
    expect(screen.getByText('Movies from Uk')).toBeInTheDocument()
  })

  it('navigates to /movies/:id when clicked and username is provided', async () => {
    render(
      <MemoryRouter>
        <Home username="alice" searchTerm="" searchType="title" />
      </MemoryRouter>
    )
    expect(await screen.findByText('Movie 1')).toBeInTheDocument()
    screen.getByText('Movie 3').click()
    expect(mockNavigate).toHaveBeenCalledWith('/movies/3')
  })

  it('navigates to /login when clicked and no username', async () => {
    render(
      <MemoryRouter>
        <Home searchTerm="" searchType="title" />
      </MemoryRouter>
    )
    expect(await screen.findByText('Movie 1')).toBeInTheDocument()
    screen.getByText('Movie 4').click()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('handles keyboard Enter on focused card the same as click', async () => {
    render(
      <MemoryRouter>
        <Home username="bob" searchTerm="" searchType="title" />
      </MemoryRouter>
    )
    expect(await screen.findByText('Movie 1')).toBeInTheDocument()
    const card = screen
      .getByText('Movie 5')
      .closest('[role="button"]') as HTMLElement
    card.focus()
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/movies/5')
  })
})
