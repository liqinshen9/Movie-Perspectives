import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ChatPage from './ChatPage'
import { getHistory, postMessage } from '../api/chatService'

HTMLDivElement.prototype.scrollTo = vi.fn()

vi.mock('../api/chatService', () => ({
  getHistory: vi.fn(),
  postMessage: vi.fn(),
}))


;(globalThis.fetch as any) = vi.fn()

describe('ChatPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    ;(getHistory as any).mockResolvedValue([
      { id: 1, fromUsername: 'alice', text: 'Hello', sentAt: '2025-01-01T00:00:00Z' },
      { id: 2, fromUsername: 'bob',   text: 'Hey',   sentAt: '2025-01-01T00:00:01Z' },
    ])

   
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ shared: false }),
    })
  })

  it('redirects to /login if currentUser is empty', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/bob']}>
        <Routes>
          <Route path="/login" element={<div>LoginPage</div>} />
          <Route path="/chat/:withUser" element={<ChatPage currentUser="" />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('LoginPage')).toBeInTheDocument()
  })

  it('shows error when no withUser param', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <Routes>
          <Route path="/chat" element={<ChatPage currentUser="alice" />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('No chat partner specified.')).toBeInTheDocument()
  })

  it('renders chat history and heading', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/bob']}>
        <Routes>
          <Route path="/chat/:withUser" element={<ChatPage currentUser="alice" />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('Chat with bob')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hey')).toBeInTheDocument()
  })

  it('sends message when Send clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/bob']}>
        <Routes>
          <Route path="/chat/:withUser" element={<ChatPage currentUser="alice" />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText('Chat with bob')).toBeInTheDocument()

    const textarea = screen.getByPlaceholderText('Type your message…')
    fireEvent.change(textarea, { target: { value: 'Test msg' } })

    ;(postMessage as any).mockResolvedValue(undefined)

    fireEvent.click(screen.getByText('Send'))

    await waitFor(() => {
      expect(postMessage).toHaveBeenCalledWith('alice', 'bob', 'Test msg')
    })
  })
})
