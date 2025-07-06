import React, { useContext }       from 'react';
import { NavLink, useNavigate }    from 'react-router-dom';
import { FiHome, FiLogIn, FiUserPlus, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import { ThemeContext }            from '../context/ThemeContext';
import { getAvatarColor }          from '../utils/avatar';
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
  const avatarBg     = username ? getAvatarColor(username) : '#3498db';

  return (
    <header className="site-header">
      <div className="logo">
        <FiHome size={24} style={{ marginRight: 8 }} />
        <span>Movie Perspectives</span>
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

            <button
              onClick={handleLogout}
              className="nav-link logout-link"
            >
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
          {theme === 'light' ? <FiMoon size={20}/> : <FiSun size={20}/>}
        </button>
      </nav>
    </header>
);
}
