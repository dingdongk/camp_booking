import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { CHAT_SUGGESTIONS, getChatIntro } from '../../api/chat'
import { useFeedback } from '../../components/ui/Feedback'

export async function loader() {
  return { messages: await getChatIntro() }
}

// Static UI: the conversation, extracted filters and matches will come from the chat REST endpoint.
export default function ChatPage() {
  const { messages } = useLoaderData<typeof loader>()
  const { notConnected } = useFeedback()
  const [draft, setDraft] = useState('')

  return (
    <div className="wrap">
      <div className="sec">
        <div>
          <h1 style={{ fontSize: 27 }}>AI campsite assistant</h1>
          <p className="mut" style={{ marginTop: 6 }}>Describe your trip. The assistant turns it into filters and only returns campsites from the VietCamp directory.</p>
        </div>
        <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={notConnected}>New conversation</button>
      </div>
      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 520px' }}>
          <div className="card chat">
            <div className="msgs">
              {messages.map((m, i) => (
                <div key={i} className={m.who === 'bot' ? 'msg bot' : 'msg usr'} style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              ))}
            </div>
            <div style={{ padding: '0 18px 14px' }}>
              <p className="mut" style={{ marginBottom: 8 }}>Try asking:</p>
              <div className="sugg">
                {CHAT_SUGGESTIONS.slice(0, 4).map((s) => <button key={s} onClick={notConnected}>{s}</button>)}
              </div>
            </div>
            <div className="cin">
              <input className="inp" type="text" placeholder="e.g. quiet campsite near Da Lat for 4 people under 800,000 ₫" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button className="btn p" onClick={notConnected}>Send</button>
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 360px' }}>
          <div className="card pad">
            <h3>Interpreted preferences</h3>
            <p className="mut" style={{ marginTop: 4 }}>What the assistant understood, as search filters.</p>
            <p className="mut" style={{ marginTop: 12 }}>Nothing yet — send a message to see the filters.</p>
            <div className="hr"></div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn s" disabled>Open in search</button>
              <button className="btn s" onClick={notConnected}>Adjust preferences</button>
            </div>
          </div>
          <div className="card pad" style={{ marginTop: 18 }}>
            <h3>Matching campsites</h3>
          </div>
        </aside>
      </div>
    </div>
  )
}
