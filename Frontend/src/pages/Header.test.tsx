import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import Header from './Header';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ to, children, className }: any) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  };
});

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  const renderWithTheme = (
    username: string | null,
    toggle = () => {},
    searchTerm = '',
    setSearchTerm = () => {},
    searchType: 'title' | 'country' = 'title',
    setSearchType = () => {}
  ) =>
    render(
      <ThemeContext.Provider value={{ theme: 'light', toggle }}>
        <MemoryRouter>
          <Header
            username={username}
            onLogout={vi.fn()}
            // NEW props for the unified search bar:
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
          />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

  it('renders Login and Register when logged out', () => {
    renderWithTheme(null);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders greeting, avatar and Logout when logged in', () => {
    renderWithTheme('alice');
    expect(screen.getByText('Hello, alice')).toBeInTheDocument();
    // Avatar initial
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls onLogout prop and navigates on Logout click', () => {
    const onLogout = vi.fn();
    render(
      <ThemeContext.Provider value={{ theme: 'light', toggle: () => {} }}>
        <MemoryRouter>
          <Header
            username="bob"
            onLogout={onLogout}
            // NEW props stubbed
            searchTerm=""
            setSearchTerm={() => {}}
            searchType="title"
            setSearchType={() => {}}
          />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(onLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls toggle when theme button is clicked', () => {
    const toggle = vi.fn();
    renderWithTheme(null, toggle);

    const button = screen.getByLabelText('Toggle theme');
    fireEvent.click(button);
    expect(toggle).toHaveBeenCalled();
  });
});
