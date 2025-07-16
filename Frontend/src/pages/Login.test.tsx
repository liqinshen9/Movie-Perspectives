import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { login } from '../api/authService'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../api/authService', () => ({ login: vi.fn() }))

describe('Login Component', () => {
  const onLogin = vi.fn()

  beforeEach(() => {
    mockNavigate.mockReset()
    onLogin.mockReset()
    vi.mocked(login).mockReset()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('calls onLogin and navigates on successful login', async () => {
    vi.mocked(login).mockResolvedValueOnce(undefined)
    render(<MemoryRouter><Login onLogin={onLogin} /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('alice'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('alerts on failed login', async () => {
    vi.mocked(login).mockRejectedValueOnce(new Error('fail'))
    const alertSpy = vi.spyOn(window, 'alert')
    render(<MemoryRouter><Login onLogin={onLogin} /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bob' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Invalid credentials or unregistered!'))
    expect(onLogin).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
