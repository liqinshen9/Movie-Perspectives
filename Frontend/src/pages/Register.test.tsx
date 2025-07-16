import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Register from './Register'
import { register } from '../api/authService'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../api/authService', () => ({ register: vi.fn() }))

describe('Register Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    vi.mocked(register).mockReset()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('registers and navigates to login on success', async () => {
    vi.mocked(register).mockResolvedValueOnce(undefined)
    const alertSpy = vi.spyOn(window, 'alert')
    render(<MemoryRouter><Register /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newuser' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Register' }))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Registered! Please log in.'))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('alerts error message on failure', async () => {
    vi.mocked(register).mockRejectedValueOnce(new Error('Registration failed'))
    const alertSpy = vi.spyOn(window, 'alert')
    render(<MemoryRouter><Register /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'x' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'y' } })
    fireEvent.click(screen.getByRole('button', { name: 'Register' }))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Registration failed'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
