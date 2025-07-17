import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Profile from './Profile'
import { getCurrentUser } from '../api/authService'

vi.mock('../api/authService', () => ({
  getCurrentUser: vi.fn(),
}))


;(globalThis.fetch as any) = vi.fn()

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getCurrentUser as any).mockReturnValue('alice')

    ;(globalThis.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/introduction')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ introduction: 'Hello world' }),
        })
      }
      if (url.includes('/followers')) {
        return Promise.resolve({
          ok: true,
          json: async () => ['bob'],
        })
      }
      if (url.includes('/following')) {
        return Promise.resolve({
          ok: true,
          json: async () => ['charlie'],
        })
      }
      if (url.includes('/private')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            phone: '123',
            email: 'a@b',
            occupation: 'Dev',
          }),
        })
      }
      return Promise.resolve({ ok: false })
    })
  })

  it('renders own profile with both Edit buttons and contact section', async () => {
    render(
      <MemoryRouter initialEntries={['/profile/alice']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    )


    expect(await screen.findByText('Profile: alice')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()

   
    const edits = screen.getAllByText('Edit')
    expect(edits).toHaveLength(2)


    expect(screen.getByText('Contact & Occupation')).toBeInTheDocument()
  })

  it('renders other user profile with follow & message', async () => {
    ;(getCurrentUser as any).mockReturnValue('dave')

    render(
      <MemoryRouter initialEntries={['/profile/alice']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('Profile: alice')).toBeInTheDocument()

    
    expect(screen.getByText('Follow')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()

    
    fireEvent.click(screen.getByText('Follow'))
    await waitFor(() => {
      expect((globalThis.fetch as any)).toHaveBeenCalledWith(
        expect.stringContaining('/follow'),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
