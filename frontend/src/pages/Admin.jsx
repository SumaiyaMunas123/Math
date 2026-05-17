import { useState } from 'react'
import axios from 'axios'

export default function Admin(){
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('adminToken')||'')
  const [jsonText, setJsonText] = useState('')

  const login = async ()=>{
    try{
      const res = await axios.post('/api/login',{password})
      setToken(res.data.token)
      localStorage.setItem('adminToken', res.data.token)
      alert('Logged in')
    }catch(err){alert('Login failed')}
  }

  const save = async ()=>{
    try{
      const body = JSON.parse(jsonText)
      await axios.post('/api/content', body, { headers: { Authorization: `Bearer ${token}` } })
      alert('Saved')
    }catch(err){alert('Save failed')}
  }

  return (
    <div>
      <h1>Admin</h1>
      {!token ? (
        <div>
          <input placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <p style={{color:'var(--text)'}}>Paste JSON content for grades and announcements then Save.</p>
          <textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} rows={12} style={{width:'100%'}} />
          <div style={{marginTop:8}}>
            <button onClick={save}>Save</button>
          </div>
        </div>
      )}
    </div>
  )
}
