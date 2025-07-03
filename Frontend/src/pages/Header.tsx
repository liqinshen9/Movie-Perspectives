// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom'
import {
  Home,
  Info,
  BookOpen,
  Smartphone,
  ShoppingCart,
  UserCog,
  Settings
} from 'lucide-react'
import './Header.css'

interface HeaderProps {
  username: string | null
  onLogout: () => void
}

export default function Header({ username, onLogout }: HeaderProps) {
  const nav = useNavigate()
  const handleLogout = () => {
    onLogout()
    nav('/login')
  }

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/"        className="nav-item"><Home   /> <span>Home</span></Link>
        <Link to="/about"   className="nav-item"><Info   /> <span>About</span></Link>
        <Link to="/menu"    className="nav-item"><BookOpen/> <span>Menu</span></Link>
        <Link to="/contact" className="nav-item"><Smartphone/> <span>Contact</span></Link>
        <Link to="/order"   className="nav-item"><ShoppingCart/> <span>Order</span></Link>
        {username === 'admin' && (
          <Link to="/admin" className="nav-item"><UserCog/> <span>Admin</span></Link>
        )}
      </nav>

      <div className="header-actions">
        <button className="theme-toggle" onClick={() => {/* your toggle */}}>
          <Settings />
        </button>

        {username
          ? <button className="nav-item logout-btn" onClick={handleLogout}>
              <span>Logout</span>
            </button>
          : <>
              <Link to="/login"    className="nav-item auth-btn"><span>Login</span></Link>
              <Link to="/register" className="nav-item auth-btn"><span>Register</span></Link>
            </>
        }
      </div>
    </header>
  )
}
