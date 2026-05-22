import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Topic(){
  const { id, topicId } = useParams()
  const [content, setContent] = useState(null)
  const [tab, setTab] = useState('tutorials')
  const [recordings, setRecordings] = useState([])
  const [recordingsLoading, setRecordingsLoading] = useState(false)
  const [showAccessMessage, setShowAccessMessage] = useState(false)
  const { hasAccess, isAdmin } = useAuth()

  useEffect(()=>{
    axios.get('/api/content').then(r=>setContent(r.data)).catch(()=>{})
  },[])

  const grade = content?.grades?.find(g=>g.id===id) || { topics: [] }
  const topic = grade.topics?.find(t=>t.id===topicId) || { title: topicId, term: 'Term', tutorials:[], resources:[], questions:[] }
  const tutorials = topic.tutorials?.length ? topic.tutorials : []
  const resources = topic.resources?.length ? topic.resources : []
  const papers = topic.papers?.length ? topic.papers : []
  const studentQuestions = topic.studentQuestions?.length ? topic.studentQuestions : []
  const canViewRecordings = hasAccess || isAdmin
  const accessMessage = useMemo(() => 'Send the agreed payment via bank transfer or your preferred payment method and WhatsApp your email to +94 777 492 746 to get access unlocked within 24 hours.', [])

  const [localQuestions, setLocalQuestions] = useState(studentQuestions)
  const [qForm, setQForm] = useState({ name: '', email: '', question: '' })
  const [replyDrafts, setReplyDrafts] = useState({})

  useEffect(()=>{
    // refresh content after initial load
    if (content) {
      const grade = content?.grades?.find(g=>g.id===id)
      const t = grade?.topics?.find(x=>x.id===topicId)
      setLocalQuestions(t?.studentQuestions || [])
    }
  }, [content, id, topicId])

  useEffect(() => {
    if (!canViewRecordings || !supabase) {
      setRecordings([])
      return
    }

    const loadRecordings = async () => {
      setRecordingsLoading(true)
      const { data, error } = await supabase
        .from('topic_recordings')
        .select('id, title, video_url, preview_text, sort_order')
        .eq('grade_id', id)
        .eq('topic_id', topicId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (!error) {
        setRecordings(data || [])
      } else {
        console.error(error)
        setRecordings([])
      }

      setRecordingsLoading(false)
    }

    loadRecordings()
  }, [canViewRecordings, id, topicId])

  const handleQChange = (e) => {
    const { name, value } = e.target
    setQForm(prev => ({ ...prev, [name]: value }))
  }

  const submitQuestion = async (e) => {
    e.preventDefault()
    if (!qForm.name || !qForm.question) return
    try {
      const res = await axios.post(`/api/topic/${id}/${topic.id}/questions`, qForm)
      setLocalQuestions(prev => [res.data, ...prev])
      setQForm({ name: '', email: '', question: '' })
    } catch (err) {
      console.error(err)
      alert('Failed to post question; try again later.')
    }
  }

  const submitReply = async (questionId) => {
    const draft = replyDrafts[questionId]
    if (!draft?.name || !draft?.message) return
    try {
      const res = await axios.post(`/api/topic/${id}/${topic.id}/questions/${questionId}/replies`, draft)
      setLocalQuestions(prev => prev.map(q => q.id === questionId ? { ...q, replies: [...(q.replies || []), res.data] } : q))
      setReplyDrafts(prev => ({ ...prev, [questionId]: { name: '', message: '' } }))
    } catch (err) {
      console.error(err)
      alert('Failed to post reply; try again later.')
    }
  }

  return (
    <div style={{maxWidth: 900, width: '100%'}}><h1 style={{textAlign:"center"}}>{topic.title}</h1>
      <p style={{textAlign: 'center', opacity: 0.9, marginTop: -4}}>{topic.term}</p>
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
        <button 
          className={`topic-tab ${tab==='papers'?'active':''}`}
          onClick={()=>setTab('papers')}
        >
          Papers
        </button>
        <button 
          className={`topic-tab ${tab==='videos'?'active':''}`}
          onClick={()=>setTab('videos')}
        >
          Videos
        </button>
        <button 
          className={`topic-tab ${tab==='recordings'?'active':''}`}
          onClick={()=>setTab('recordings')}
        >
          Recordings
        </button>
        <button 
          className={`topic-tab ${tab==='questions'?'active':''}`}
          onClick={()=>setTab('questions')}
        >
          Questions
        </button>
      </div>

      <div style={{marginTop:16, textAlign:'left', width:'100%'}}>
        {tab==='tutorials' && <div style={{textAlign:'center'}}></div>}

        {tab==='resources' && (
          <div style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
            {resources.map(r=> (
              <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="resource-link" style={{minWidth:220}}>
                <strong style={{display:'block', marginBottom:6}}>{r.title}</strong>
              </a>
            ))}
          </div>
        )}

        {tab==='papers' && (
          <div style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
            {papers.map(p=> (
              <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="resource-link" style={{minWidth:220}}>
                <strong style={{display:'block', marginBottom:6}}>{p.title}</strong>
              </a>
            ))}
          </div>
        )}

        {tab==='videos' && (
          <div style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
            {tutorials.map(v=> (
              <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="resource-link" style={{minWidth:240}}>{v.title}</a>
            ))}
          </div>
        )}

        {tab==='recordings' && (
          <div style={{maxWidth:760, margin:'0 auto'}}>
            {!canViewRecordings ? (
              <div>
                <div className="recordings-lock-panel">
                  <h3>Recordings are locked</h3>
                  <p>Free notes, resources and YouTube links stay open. Recordings unlock after admin approval.</p>
                  <button type="button" onClick={() => setShowAccessMessage(prev => !prev)}>
                    Get Access
                  </button>
                  {showAccessMessage && <p className="access-message">{accessMessage}</p>}
                </div>

                <div className="recordings-grid">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="recording-card recording-card-locked">
                      <div className="recording-overlay">Locked preview</div>
                      <h4>Recording {item}</h4>
                      <p>Unlocked after payment verification.</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {recordingsLoading && <p style={{ textAlign: 'center' }}>Loading recordings...</p>}
                {!recordingsLoading && recordings.length === 0 && (
                  <div className="recordings-lock-panel">
                    <h3>No recordings added yet</h3>
                    <p>Once you add rows in Supabase, unlocked students will see them here.</p>
                  </div>
                )}
                <div className="recordings-grid">
                  {recordings.map((recording) => {
                    const embedUrl = recording.video_url.includes('youtube.com/watch')
                      ? `https://www.youtube.com/embed/${new URL(recording.video_url).searchParams.get('v')}`
                      : recording.video_url.includes('youtu.be/')
                        ? `https://www.youtube.com/embed/${recording.video_url.split('/').pop().split('?')[0]}`
                        : recording.video_url

                    return (
                      <div key={recording.id} className="recording-card">
                        <h4>{recording.title}</h4>
                        {embedUrl.includes('youtube.com/embed/') ? (
                          <iframe
                            width="100%"
                            height="220"
                            src={embedUrl}
                            title={recording.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <a className="resource-link" href={recording.video_url} target="_blank" rel="noreferrer">
                            Open recording
                          </a>
                        )}
                        {recording.preview_text && <p style={{ marginTop: 10 }}>{recording.preview_text}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==='questions' && (
          <div style={{maxWidth:760, margin:'0 auto', textAlign:'left'}}>
            <form onSubmit={submitQuestion} style={{marginBottom:16}}>
              <div className="form-group"><label>Name</label><input name="name" value={qForm.name} onChange={handleQChange} required /></div>
              <div className="form-group"><label>Email (optional)</label><input name="email" value={qForm.email} onChange={handleQChange} /></div>
              <div className="form-group"><label>Message</label><textarea name="question" rows={4} value={qForm.question} onChange={handleQChange} placeholder="Drop a question or message..." required /></div>
              <button type="submit">Post Message</button>
            </form>

            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              {localQuestions.length === 0 && <div style={{color: 'var(--text)'}}>No messages yet. Start the conversation.</div>}
              {localQuestions.map(q => (
                <div key={q.id} className="video-container" style={{padding:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
                    <strong>{q.name}</strong>
                    <span style={{fontSize:12, color:'var(--text)'}}>{new Date(q.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{marginTop:8, marginBottom:12}}>{q.question}</p>

                  <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:12}}>
                    {(q.replies || []).map(reply => (
                      <div key={reply.id} style={{padding:'10px 12px', borderRadius:8, background: reply.isAdmin ? 'rgba(59,79,58,0.12)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', gap:12, marginBottom:4}}>
                          <strong>{reply.name}</strong>
                          <span style={{fontSize:12, color:'var(--text)'}}>{new Date(reply.createdAt).toLocaleString()}</span>
                        </div>
                        <div>{reply.message}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{paddingTop:10, borderTop:'1px solid var(--glass-border)'}}>
                    <div className="form-group" style={{marginBottom:10}}>
                      <label>Reply</label>
                      <input
                        value={replyDrafts[q.id]?.name || ''}
                        onChange={(e)=>setReplyDrafts(prev => ({ ...prev, [q.id]: { ...(prev[q.id] || {}), name: e.target.value } }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="form-group" style={{marginBottom:10}}>
                      <textarea
                        rows={3}
                        value={replyDrafts[q.id]?.message || ''}
                        onChange={(e)=>setReplyDrafts(prev => ({ ...prev, [q.id]: { ...(prev[q.id] || {}), message: e.target.value } }))}
                        placeholder="Write a reply..."
                      />
                    </div>
                    <button type="button" onClick={()=>submitReply(q.id)}>Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





