import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { ToyDetails } from './pages/ToyDetails.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { About } from './pages/About.jsx'
import { ToyProvider } from './app/store.jsx'
import { useOnlineStatus } from './hooks/useOnlineStatus.js'
import { Login } from './pages/Login.jsx'
import { onUserChange, userService } from './services/user.service.js'
import { UserDetails } from './pages/UserDetails.jsx'
import { ReviewExplore } from './pages/ReviewExplore.jsx'

export default function App() {
  const isOnline = useOnlineStatus()
  const [user, setUser] = useState(userService.getLoggedinUser())
  const navigate = useNavigate()

  useEffect(() => {
    onUserChange(nextUser => setUser(nextUser))
  }, [])

  async function onLogout() {
    await userService.logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <ToyProvider>
      <header className="site-header">
        <div className="container header-inner">
          <nav className="main-nav left-side">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>

          <NavLink to="/" className="brand">Mister Toy</NavLink>

          <div className="right-side">
            {user ? (
              <span className="user-controls">
                <span className="greet">
                  <NavLink to={`/user/${user._id}`} className="user-link">Hello, {user.fullname}</NavLink>
                  {user.isAdmin && <span className="admin-label"> (Admin)</span>}
                </span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </span>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
            <div className="status">
              <span className={'dot ' + (isOnline ? 'on' : 'off')}></span>
              <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ToyIndex />} />
          <Route path="/toy" element={<ToyIndex />} />
          <Route path="/toy/:toyId" element={<ToyDetails />} />
          <Route path="/toy/edit" element={<ToyEdit />} />
          <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/:userId" element={<UserDetails />} />
          <Route path="/reviews" element={<ReviewExplore />} />
        </Routes>
      </main>
    </ToyProvider>
  )
}
