import { NavLink, Routes, Route } from 'react-router-dom'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { ToyDetails } from './pages/ToyDetails.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { ToyProvider } from './app/store.jsx'
import { useOnlineStatus } from './hooks/useOnlineStatus.js'

export default function App() {
  const isOnline = useOnlineStatus()
  return (
    <ToyProvider>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">Mister Toy</NavLink>
          <div className="right-side">
            <nav className="main-nav">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </nav>
            <div className="status"><span className={'dot ' + (isOnline ? 'on' : 'off')}></span><span className="status-text">{isOnline ? 'Online' : 'Offline'}</span></div>
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
        </Routes>
      </main>
    </ToyProvider>
  )
}
