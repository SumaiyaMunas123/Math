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

  return (
    <div>
      <h1>{grade.title}</h1>
      <p style={{color:'var(--text)'}}>Topics</p>
      <ul style={{textAlign:'left', marginTop:12}}>
        {(grade.topics.length?grade.topics:[{id:'geom',title:'Geometry (placeholder)'},{id:'algebra',title:'Algebra basics'}]).map(t=> (
          <li key={t.id} style={{margin:'10px 0'}}>
            <Link to={`/grade/${id}/topic/${t.id}`} style={{color:'var(--forest)'}}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
