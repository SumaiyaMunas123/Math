import { useState } from 'react'

export default function AskQuestion(){
  const [form, setForm] = useState({ name: '', email: '', question: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending - in production, integrate with EmailJS or backend
    setTimeout(() => {
      setMessage('Question sent! We\'ll get back to you soon at ' + form.email)
      setForm({ name: '', email: '', question: '' })
      setLoading(false)
    }, 800)
  }

  return (<div style={{maxWidth: 600, margin: "0 auto", textAlign: "center"}}>
      <h1>Ask a Question</h1>
      <p style={{marginBottom:24}}>Have something on your mind? Send us a message and we'll respond shortly.</p>
      
      {message && <p style={{color: '#51cf66', marginBottom:16, fontWeight:500}}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{maxWidth:500, margin:"0 auto"}}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Your Question</label>
          <textarea name="question" rows={6} value={form.question} onChange={handleChange} placeholder="Ask anything about the topics..." required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Question'}</button>
      </form>
      
      <p style={{marginTop:24, fontSize:14}}>💡 Alternatively, join our community on Telegram or WhatsApp for quick help!</p>
    </div>
  )
}

