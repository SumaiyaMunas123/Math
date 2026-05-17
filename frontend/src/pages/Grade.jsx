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
    <div style={{maxWidth: 600, textAlign: 'center'}}>
      <h1>{grade.title}</h1>
      <p style={{marginBottom:24}}>Master the topics at your own pace with tutorials and resources.</p>
      <ul style={{textAlign:'center', marginTop:12, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
        {(grade.topics.length?grade.topics:[{id:'geom',title:'Geometry'},{id:'algebra',title:'Algebra'},{id:'trig',title:'Trigonometry'}]).map(t=> (
          <li key={t.id} style={{width:'100%', maxWidth:400}}>
            <Link to={`/grade/${id}/topic/${t.id}`} className="resource-link">{t.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
