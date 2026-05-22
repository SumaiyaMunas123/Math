import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) {
      alert('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.')
      return
    }

    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setBusy(false)

    if (error) {
      alert(error.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Access free content and, if approved, locked recordings.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="auth-switch">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
