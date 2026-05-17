import { useState } from 'react'
import axios from 'axios'

export default function AskQuestion(){
  const [form, setForm] = useState({ name: '', email: '', grade: '', unit: '', question: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/questions', form)
      setMessage('Question sent successfully. Check your email inbox for a reply soon.')
      setMessageType('success')
      setForm({ name: '', email: '', grade: '', unit: '', question: '' })
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Sending failed. Please try again or use WhatsApp.'
      setMessage(errorMessage)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (<div style={{maxWidth: 600, margin: "0 auto", textAlign: "center"}}>
      <h1>Ask a Question</h1>
      <p style={{marginBottom:24}}>Have something on your mind? Send us a message and we'll respond shortly.</p>
      
      {message && <p style={{color: messageType === 'success' ? '#51cf66' : '#ff8787', marginBottom:16, fontWeight:500}}>{message}</p>}
      
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
          <label>Grade (optional)</label>
          <input type="text" name="grade" value={form.grade} onChange={handleChange} placeholder="9, 10 or 11" />
        </div>
        <div className="form-group">
          <label>Unit / Topic (optional)</label>
          <input type="text" name="unit" value={form.unit} onChange={handleChange} placeholder="Example: Trigonometry" />
        </div>
        <div className="form-group">
          <label>Your Question</label>
          <textarea name="question" rows={6} value={form.question} onChange={handleChange} placeholder="Ask anything about the topics..." required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Question'}</button>
      </form>
      
      <p style={{marginTop:24, fontSize:14}}>Alternatively, join our community on Telegram or WhatsApp for quick help.</p>
    </div>
  )
}

