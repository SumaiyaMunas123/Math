import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Grade from './pages/Grade'
import Topic from './pages/Topic'
import About from './pages/About'
import Community from './pages/Community'
import AskQuestion from './pages/AskQuestion'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <header className="site-header">
          <Link to="/" className="brand">Math Classroom</Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/community">Community</Link>
            <Link to="/ask">Ask a Question</Link>
          </nav>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grade/:id" element={<Grade />} />
            <Route path="/grade/:id/topic/:topicId" element={<Topic />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/ask" element={<AskQuestion />} />
          </Routes>
        </main>

        <Footer />

        <a href="https://wa.me/94777492746?text=Hello%21%20Can%20I%20please%20get%20more%20details%20about%20this%20class%3F" className="whatsapp-cta" aria-label="Book a session" target="_blank" rel="noreferrer">Book a Session</a>
      </div>
    </BrowserRouter>
  )
}

export default App
