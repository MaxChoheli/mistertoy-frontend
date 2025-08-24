import { NavLink, Routes, Route } from 'react-router-dom'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { ToyDetails } from './pages/ToyDetails.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { ToyProvider } from './app/store.jsx'

export default function App() {
  return (
    <ToyProvider>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">Mister Toy</NavLink>
          <nav className="main-nav">
            <NavLink to="/">Home</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ToyIndex />} />
          <Route path="/toy" element={<ToyIndex />} />
          <Route path="/toy/:toyId" element={<ToyDetails />} />
          <Route path="/toy/edit" element={<ToyEdit />} />
          <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
        </Routes>
      </main>
    </ToyProvider>
  )
}
