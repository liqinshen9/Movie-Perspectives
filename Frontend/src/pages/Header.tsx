import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

interface HeaderProps {
  username: string | null;
  onLogout: () => void;
}

export default function Header({ username, onLogout }: HeaderProps) {
  const { theme, toggle } = useContext(ThemeContext);
  const nav = useNavigate();

  const handleLogout = () => {
    onLogout();
    nav('/login');
  };

  const avatarLetter = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="site-header">
      <h1 className="logo">🎬 Movie Perspectives</h1>

      <nav className="header-nav">
        <Link to="/">Home</Link>

        {username && (
          <>
            <span className="greeting">Hello, {username}</span>

            {/* Avatar link */}
            <Link to={`/profile/${username}`} className="avatar-link">
              <div className="avatar">{avatarLetter}</div>
            </Link>

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        )}

        <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
);
}