import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', contactNumber: '' })
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
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          contact_number: form.contactNumber,
        },
      },
    })
    setBusy(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Account created. If email confirmation is enabled, check your inbox before logging in.')
    navigate('/login')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <p>Create your student account with name, email, password and contact number.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
