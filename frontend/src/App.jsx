import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Grade from './pages/Grade'
import Topic from './pages/Topic'
import About from './pages/About'
import Community from './pages/Community'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="site-header">
          <Link to="/" className="brand">Math Classroom</Link>
          <nav className="nav-links">
            <Link to="/about">About</Link>
            <Link to="/community">Community</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grade/:id" element={<Grade />} />
            <Route path="/grade/:id/topic/:topicId" element={<Topic />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <a href="https://chat.whatsapp.com/DxfBQaNfeu4I8FjYzO5sMq" className="whatsapp-cta" aria-label="Book a session" target="_blank" rel="noreferrer">Book a Session</a>
      </div>
    </BrowserRouter>
  )
}

export default App
