import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Grade from './pages/Grade'
import Topic from './pages/Topic'
import About from './pages/About'
import Community from './pages/Community'
import AskQuestion from './pages/AskQuestion'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import Footer from './components/Footer'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RequireAdmin } from './components/RouteGuards'

function Header() {
  const { user, profile, isAdmin, signOut, loading } = useAuth()

  return (
    <header className="site-header">
      <Link to="/" className="brand">Math Classroom</Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/community">Community</Link>
        <Link to="/ask">Ask a Question</Link>
        {!loading && !user && <Link to="/login">Login</Link>}
        {!loading && !user && <Link to="/signup">Sign Up</Link>}
        {!loading && isAdmin && <Link to="/admin">Admin</Link>}
        {!loading && user && (
          <button type="button" className="nav-button" onClick={() => signOut()}>
            Logout
          </button>
        )}
      </nav>
      {profile?.full_name && <span className="nav-user">{profile.full_name}</span>}
    </header>
  )
}

function GuardedAdminRoute() {
  return <RequireAdmin><Admin /></RequireAdmin>
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Header />

          <main className="site-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/grade/:id" element={<Grade />} />
              <Route path="/grade/:id/topic/:topicId" element={<Topic />} />
              <Route path="/about" element={<About />} />
              <Route path="/community" element={<Community />} />
              <Route path="/ask" element={<AskQuestion />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<GuardedAdminRoute />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          <a href="https://wa.me/94777492746?text=Hello%21%20Can%20I%20please%20get%20more%20details%20about%20this%20class%3F" className="whatsapp-cta" aria-label="Book a session" target="_blank" rel="noreferrer">Book a Session</a>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
