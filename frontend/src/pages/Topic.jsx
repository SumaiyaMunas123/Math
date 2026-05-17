import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Topic(){
  const { id, topicId } = useParams()
  const [content, setContent] = useState(null)
  const [tab, setTab] = useState('tutorials')

  useEffect(()=>{
    axios.get('/api/content').then(r=>setContent(r.data)).catch(()=>{})
  },[])

  const grade = content?.grades?.find(g=>g.id===id) || { topics: [] }
  const topic = grade.topics?.find(t=>t.id===topicId) || { title: topicId, tutorials:[], resources:[] }

  return (
    <div>
      <h1>{topic.title}</h1>
      <div style={{marginTop:12}}>
        <button onClick={()=>setTab('tutorials')} style={{marginRight:8}}>Tutorials</button>
        <button onClick={()=>setTab('resources')}>Resources</button>
      </div>

      <div style={{marginTop:16, textAlign:'left'}}>
        {tab==='tutorials' ? (
          <div>
            {(topic.tutorials?.length?topic.tutorials:[{id:'yt1',title:'Intro',url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}]).map(t=> (
              <div key={t.id} style={{marginBottom:12}}>
                <h4 style={{margin:0}}>{t.title}</h4>
                <div style={{marginTop:8}}>
                  <iframe width="100%" height="200" src={t.url.replace('watch?v=','embed/')} title={t.title} frameBorder="0" allowFullScreen></iframe>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {(topic.resources?.length?topic.resources:[{id:'r1',title:'Past paper (pdf)',url:'https://example.com/sample.pdf'}]).map(r=> (
              <div key={r.id} style={{marginBottom:12}}>
                <a href={r.url} target="_blank" rel="noreferrer" style={{color:'var(--forest)'}}>{r.title}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
