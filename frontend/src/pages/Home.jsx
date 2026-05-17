import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    axios.get('/api/content').then(res => setContent(res.data)).catch(() => {})
  }, [])

  const grades = content?.grades || [
    { id: '9', title: 'Grade 9' },
    { id: '10', title: 'Grade 10' },
    { id: '11', title: 'Grade 11' }
  ]

  const announcements = content?.announcements || [
    { id: '1', text: 'New tutorials for Algebra added this week!' },
    { id: '2', text: 'Mock exam papers now available in Resources.' }
  ]

  return (
    <div>
      <section className="hero-spot">
        <h1>Quiet, simple math help for Sri Lankan students</h1>
        <p>Personal classroom for Grades 9—11. Calm, focused, and clear.</p>
      </section>

      {announcements.length > 0 && (
        <section className="announcements">
          <h3>📢 Announcements</h3>
          {announcements.map(a => (
            <div key={a.id} className="announcement-item">{a.text}</div>
          ))}
        </section>
      )}

      <section>
        <h2>Choose your grade</h2>
        <div className="grades">
          {grades.map(g => (
            <Link to={`/grade/${g.id}`} key={g.id} className="grade-card">
              <h3>{g.title}</h3>
              <p>Explore topics, tutorials and resources</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
