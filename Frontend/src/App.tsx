import React, { useState }   from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';

import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';

export default function App() {
  // track login state in localStorage
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem('user')
  );

  const doLogin = () => {
    localStorage.setItem('user','yes');
    setLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <header style={{
        padding:'10px 20px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottom:'1px solid #eee'
      }}>
        <h1 style={{margin:0}}>🎥 Movie Perspectives</h1>
        <nav>
          <Link to="/"      style={{marginRight:12}}>Home</Link>
          <Link to="/login" style={{marginRight:12}}>Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main style={{padding:20}}>
        <Routes>
          {/* guard home */}
          <Route path="/" element={
            loggedIn
              ? <Home />
              : <Navigate to="/login" replace />
          }/>

          <Route path="/login"    element={<Login    onLogin={doLogin}/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
