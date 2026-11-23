import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { listReviews } from '../../api/admin'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate } from '../../utils/format'

export async function loader() {
  return { reviews: await listReviews() }
}

type Row = Awaited<ReturnType<typeof listReviews>>[number]
const TABS = [['all', 'All reviews'], ['flagged', 'Reported'], ['visible', 'Published'], ['hidden', 'Hidden']] as const
type Tab = (typeof TABS)[number][0]

const inTab = (r: Row, t: Tab) => (t === 'all' ? true : t === 'flagged' ? r.flagged : r.status === t)
const status = (r: Row): [string, string] => (r.status === 'hidden' ? ['bg er', 'Hidden'] : r.flagged ? ['bg wa', 'Reported'] : ['bg ok', 'Published'])

export default function ReviewModerationPage() {
  const { reviews } = useLoaderData<typeof loader>()
  const { notConnected, confirm } = useFeedback()
  const [tab, setTab] = useState<Tab>('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Row | null>(null)
  const list = reviews.filter((r) => inTab(r, tab) && (!q || `${r.siteName} ${r.author}`.toLowerCase().includes(q.toLowerCase())))
  const hide = (r: Row) => confirm({ title: 'Hide this review?', body: `It stays in the record but stops appearing on ${r.siteName} and no longer counts towards its rating.`, ok: 'Hide review', danger: true })

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Review moderation</h1>
          <p className="mut" style={{ marginTop: 6 }}>{reviews.length} reviews · {reviews.filter((r) => r.flagged).length} reported · {reviews.filter((r) => r.status === 'hidden').length} hidden</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 220px' }}><input className="inp" type="search" placeholder="Campsite or reviewer" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([key, label]) => <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label} ({reviews.filter((r) => inTab(r, key)).length})</button>)}
      </div>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Campsite</th><th>Reviewer</th><th>Rating</th><th>Review</th><th>Date</th><th>Verified</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td><b>{r.siteName}</b><div className="mut">{r.prov}</div></td>
                <td>{r.author}<div className="mut">{r.email}</div></td>
                <td><span className="star">★ {r.rating.toFixed(1)}</span><div className="mut">C {r.clean} · I {r.infra}</div></td>
                <td style={{ maxWidth: 320 }}><div style={{ maxWidth: 320 }}>{r.text.length > 110 ? `${r.text.slice(0, 110)}…` : r.text}</div></td>
                <td>{fmtDate(r.date)}</td>
                <td><span className="bg ok">Verified booking</span></td>
                <td><span className={status(r)[0]}>{status(r)[1]}</span></td>
                <td><div className="ac">
                  <button className="btn s" onClick={() => setSel(r)}>Details</button>
                  {r.status === 'visible' && <button className="btn d s" onClick={() => hide(r)}>Hide</button>}
                  {r.status === 'hidden' && <button className="btn p s" onClick={notConnected}>Restore</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <div className="card empty"><span className="ic">☆</span><h3>No reviews in this tab</h3><button className="btn" onClick={() => setQ('')}>Clear search</button></div>}
      <div className="card pad24" style={{ marginTop: 20 }}>
        <h3>Moderation rules</h3>
        <ul className="mut" style={{ margin: '10px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
          <li>A verified review must be linked to a booking whose stay is completed.</li>
          <li>Exactly one verified review is allowed per booking.</li>
          <li>Hidden reviews stay in the record but no longer affect the campsite rating.</li>
        </ul>
      </div>
      {sel && (
        <div className="ovl"><div className="mod wide">
          <div className="sec"><h3>Review details</h3><button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={() => setSel(null)}>Close</button></div>
          <div className="kv" style={{ marginTop: 8 }}>
            <span className="k">Campsite</span><span><b>{sel.siteName}</b></span>
            <span className="k">Reviewer</span><span>{sel.author} · {sel.email}</span>
            <span className="k">Booking</span><span>{sel.bookingRef} — verified booking</span>
            <span className="k">Ratings</span><span>Overall {sel.rating.toFixed(1)} · cleanliness {sel.clean} · infrastructure {sel.infra}</span>
            <span className="k">Date</span><span>{fmtDate(sel.date)}</span>
            <span className="k">Status</span><span><span className={status(sel)[0]}>{status(sel)[1]}</span></span>
            <span className="k">Flagged</span><span>{sel.flagged ? 'Yes — flagged by a user' : 'No'}</span>
          </div>
          <div className="hr"></div>
          <p>{sel.text}</p>
          <div className="row" style={{ marginTop: 18, justifyContent: 'flex-end', gap: 9 }}>
            <button className="btn" onClick={() => setSel(null)}>Close</button>
            <button className="btn g" onClick={notConnected}>Dismiss flag</button>
            <button className="btn d" onClick={() => { setSel(null); hide(sel) }}>Hide review</button>
          </div>
        </div></div>
      )}
    </div>
  )
}
