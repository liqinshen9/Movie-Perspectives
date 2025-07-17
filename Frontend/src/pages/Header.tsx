import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiMoon,
  FiSun,
  FiLogOut,
} from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import { getAvatarColor } from '../utils/avatar';
import './Header.css';

interface HeaderProps {
  username: string | null;
  onLogout: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: 'title' | 'country';
  setSearchType: React.Dispatch<React.SetStateAction<'title' | 'country'>>;
}

export default function Header({
  username,
  onLogout,
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
}: HeaderProps) {
  const { theme, toggle } = useContext(ThemeContext);
  const nav = useNavigate();

  const handleLogout = () => {
    onLogout();
    nav('/login');
  };

  const avatarLetter = username ? username.charAt(0).toUpperCase() : '';
  const avatarBg = username ? getAvatarColor(username) : '#3498db';

  return (
    <header className="site-header">
      <div className="logo">
        <FiHome size={24} style={{ marginRight: 8 }} />
        <span>Movie Perspectives</span>
      </div>

      {/* <--- moved here from inside the nav */}
      <div className="nav-search">
        <select
          value={searchType}
          onChange={e =>
            setSearchType(e.target.value as 'title' | 'country')
          }
        >
          <option value="title">Title</option>
          <option value="country">Country</option>
        </select>
        <input
          type="text"
          placeholder={
            searchType === 'title'
              ? 'Search movies...'
              : 'Search by country...'
          }
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <nav className="header-nav">
        <NavLink to="/" className="nav-link">
          <FiHome /> <span>Home</span>
        </NavLink>

        {username ? (
          <>
            <span className="greeting">Hello,&nbsp;{username}</span>

            <NavLink
              to={`/profile/${username}`}
              className="avatar-link"
              title={`View ${username}'s profile`}
            >
              <div
                className="avatar"
                style={{ backgroundColor: avatarBg }}
              >
                {avatarLetter}
              </div>
            </NavLink>

            <button onClick={handleLogout} className="nav-link logout-link">
              <FiLogOut /> <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              <FiLogIn /> <span>Login</span>
            </NavLink>
            <NavLink to="/register" className="nav-link">
              <FiUserPlus /> <span>Register</span>
            </NavLink>
          </>
        )}

        <button
          onClick={toggle}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
      </nav>
    </header>
  );
}
