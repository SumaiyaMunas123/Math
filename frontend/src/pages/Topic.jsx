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
    <div style={{maxWidth: 800}}><h1 style={{textAlign:"center"}}>{topic.title}</h1>
      <div className="topic-tabs" style={{justifyContent:"center"}}>
        <button 
          className={`topic-tab ${tab==='tutorials'?'active':''}`}
          onClick={()=>setTab('tutorials')}
        >
          Tutorials
        </button>
        <button 
          className={`topic-tab ${tab==='resources'?'active':''}`}
          onClick={()=>setTab('resources')}
        >
          Resources
        </button>
      </div>

      <div style={{marginTop:16, textAlign:'left'}}>
        {tab==='tutorials' ? (
          <div>
            {(topic.tutorials?.length?topic.tutorials:[
              {id:'yt1',title:'Introduction to the Topic',url:'https://www.youtube.com/embed/OTkkgDl3BYk'},
              {id:'yt2',title:'Key Concepts Explained',url:'https://www.youtube.com/embed/OTkkgDl3BYk'}
            ]).map(t=> (
              <div key={t.id} className="video-container">
                <h4>{t.title}</h4>
                <iframe width="100%" height="300" src={t.url} title={t.title} frameBorder="0" allowFullScreen></iframe>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {(topic.resources?.length?topic.resources:[
              {id:'r1',title:'Past Paper (PDF)',url:'https://nie.lk/'},
              {id:'r2',title:'Textbook Reference (NIE)',url:'https://nie.lk/'},
              {id:'r3',title:'Practice Questions',url:'https://nie.lk/'}
            ]).map(r=> (
              <div key={r.id} style={{marginBottom:12}}>
                <a href={r.url} target="_blank" rel="noreferrer" className="resource-link">{r.title}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}





