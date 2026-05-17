import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Grade(){
  const { id } = useParams()
  const [content, setContent] = useState(null)

  useEffect(()=>{
    axios.get('/api/content').then(r=>setContent(r.data)).catch(()=>{})
  },[])

  const grade = content?.grades?.find(g=>g.id===id) || { id, title: `Grade ${id}`, topics: [] }
  const groupedTopics = grade.topics.reduce((acc, topic) => {
    const term = topic.term || 'Other Topics'
    if (!acc[term]) acc[term] = []
    acc[term].push(topic)
    return acc
  }, {})
  const terms = ['Term 1', 'Term 2', 'Term 3', 'Other Topics'].filter(term => groupedTopics[term])

  return (
    <div style={{maxWidth: 820, width: '100%', textAlign: 'center'}}>
      <h1>{grade.title}</h1>
      <p style={{marginBottom:24}}>Term-by-term local syllabus units with tutorials, resources and questions.</p>

      {terms.map(term => (
        <section key={term} className="term-section">
          <h3 style={{marginBottom: 12}}>{term}</h3>
          <div className="unit-grid">
            {groupedTopics[term].map(t=> (
              <Link key={t.id} to={`/grade/${id}/topic/${t.id}`} className="unit-card unit-card-link">
                <h4>{t.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
