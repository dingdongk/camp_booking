import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CHAT_INTRO, CHAT_SUGGESTIONS } from '../../api/chat'
import { useFeedback } from '../ui/Feedback'

const HIDDEN_ON = ['/chat', '/login', '/register', '/forgot-password']
const OPEN_EVENT = 'vietcamp:open-chat'

/** Lets any page button open the floating assistant. */
export function openChatWidget() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

/** Floating mini assistant shown on every page except the full chat page and auth pages. */
export function ChatWidget() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const [open, setOpen] = useState(false)
  const [big, setBig] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, show)
    return () => window.removeEventListener(OPEN_EVENT, show)
  }, [])

  if (HIDDEN_ON.includes(pathname)) return null

  if (!open) {
    return (
      <button className="fab" onClick={() => setOpen(true)} aria-label="Open the AI campsite assistant">
        <span className="ping"></span>
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.8l1.8 4.1 4.4.5-3.3 3 .9 4.4-3.8-2.2-3.8 2.2.9-4.4-3.3-3 4.4-.5z"></path>
          <path d="M5 19.4h14" strokeLinecap="round"></path>
          <path d="M8.2 16.6l1.3-1.6M15.8 16.6l-1.3-1.6" strokeLinecap="round"></path>
        </svg>
      </button>
    )
  }

  return (
    <div className={big ? 'mini big' : 'mini'}>
      <div className="mh">
        <span className="aiav">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9CCFB4" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l1.8 4.1 4.4.5-3.3 3 .9 4.4L12 12.8 8.2 15l.9-4.4-3.3-3 4.4-.5z"></path>
          </svg>
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="ttl">VietCamp AI assistant</span><br />
          <span className="sub2">Ask in Vietnamese or English</span>
        </span>
        <button onClick={() => setBig(!big)} aria-label="Expand or shrink the chat">{big ? '⤢' : '⤡'}</button>
        <button onClick={() => setOpen(false)} aria-label="Minimize the chat">−</button>
        <button onClick={() => { setOpen(false); setBig(false) }} aria-label="Close the chat">×</button>
      </div>
      <div className="body2">
        <div className="msgs">
          <div className="msg bot" style={{ whiteSpace: 'pre-line' }}>{CHAT_INTRO.text}</div>
        </div>
        <div style={{ padding: '0 14px 10px' }}>
          <p className="mut" style={{ marginBottom: 7 }}>Try asking:</p>
          <div className="sugg">
            {CHAT_SUGGESTIONS.map((s) => <button key={s} onClick={notConnected}>{s}</button>)}
          </div>
        </div>
        <div className="row" style={{ gap: 8, padding: '0 14px 10px' }}>
          <button className="btn s" onClick={() => { setOpen(false); navigate('/chat') }}>Full assistant page</button>
        </div>
        <div className="cin">
          <input className="inp" type="text" placeholder="Ask about campsites, regions, budget, facilities" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button className="btn p" onClick={notConnected} aria-label="Send">Send</button>
        </div>
      </div>
    </div>
  )
}
