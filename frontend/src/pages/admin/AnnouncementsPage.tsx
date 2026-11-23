import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { listAnnouncements } from '../../api/admin'
import { useFeedback } from '../../components/ui/Feedback'
import type { Announcement } from '../../types/models'
import { fmtDate } from '../../utils/format'

export async function loader() {
  return { announcements: await listAnnouncements() }
}

const STATUS: Record<Announcement['status'], [string, string]> = { published: ['bg ok', 'Published'], draft: ['bg mu', 'Draft'] }
const EMPTY = { id: null as string | null, title: '', aud: 'All users', body: '' }

export default function AnnouncementsPage() {
  const { announcements } = useLoaderData<typeof loader>()
  const { notConnected, confirm } = useFeedback()
  const [form, setForm] = useState(EMPTY)
  const [prevId, setPrevId] = useState(announcements[0]?.id)
  const prev = announcements.find((a) => a.id === prevId)

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Announcements</h1><p className="mut" style={{ marginTop: 6 }}>{announcements.length} announcements · {announcements.filter((a) => a.status === 'published').length} published</p></div>
        <button className="btn p mla" style={{ marginLeft: 'auto' }} onClick={() => setForm(EMPTY)}>Create announcement</button>
      </div>
      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 440px' }}>
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Title</th><th>Audience</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {announcements.map((a) => (
                  <tr key={a.id}>
                    <td><b>{a.title}</b><div className="mut">{a.body.split('\n')[0].slice(0, 70)}…</div></td>
                    <td>{a.aud}</td>
                    <td>{fmtDate(a.date)}</td>
                    <td><span className={STATUS[a.status][0]}>{STATUS[a.status][1]}</span></td>
                    <td><div className="ac">
                      <button className="btn s" onClick={() => setPrevId(a.id)}>Preview</button>
                      <button className="btn s" onClick={() => { setForm({ id: a.id, title: a.title, aud: a.aud, body: a.body }); setPrevId(a.id) }}>Edit</button>
                      <button className="btn s" onClick={notConnected}>{a.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                      <button className="btn d s" onClick={() => confirm({ title: 'Delete this announcement?', body: `"${a.title}" is removed for everyone. This cannot be undone.`, ok: 'Delete', danger: true })}>Delete</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {announcements.length === 0 && <div className="card empty"><span className="ic">📣</span><h3>No announcements yet</h3><button className="btn p" onClick={() => setForm(EMPTY)}>Create the first one</button></div>}
        </div>
        <aside style={{ flex: '0 0 420px' }}>
          <div className="card pad24">
            <h3>{form.id ? 'Edit announcement' : 'Create announcement'}</h3>
            <div className="col" style={{ gap: 14, marginTop: 14 }}>
              <div className="fld"><span className="lbl">Title *</span><input className="inp" type="text" placeholder="Rainy season safety reminder" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="fld"><span className="lbl">Audience</span>
                <select className="inp" value={form.aud} onChange={(e) => setForm({ ...form, aud: e.target.value })}>
                  <option value="All users">All users</option><option value="Campers">Campers</option><option value="Campsite owners">Campsite owners</option>
                </select>
              </div>
              <div className="fld"><span className="lbl">Content *</span>
                <textarea className="inp" style={{ minHeight: 140 }} placeholder="Write the announcement campers and owners will read." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}></textarea>
              </div>
              <div className="row">
                <button className="btn p" onClick={notConnected}>{form.id ? 'Save and publish' : 'Publish'}</button>
                <button className="btn" onClick={notConnected}>Save as draft</button>
                <button className="btn g" onClick={() => setForm(EMPTY)}>Clear</button>
              </div>
            </div>
          </div>
          {prev && (
            <div className="card pad24" style={{ marginTop: 18 }}>
              <div className="sec"><h3>Preview</h3><span className={`${STATUS[prev.status][0]} mla`} style={{ marginLeft: 'auto' }}>{STATUS[prev.status][1]}</span></div>
              <div className="card pad" style={{ boxShadow: 'none', background: '#E4EFE8', borderColor: '#C9E3D5' }}>
                <div className="row" style={{ gap: 8 }}><span className="bg ok">VietCamp notice</span><span className="mut">{prev.aud}</span></div>
                <h4 style={{ marginTop: 10 }}>{prev.title}</h4>
                <p style={{ marginTop: 7, whiteSpace: 'pre-line' }}>{prev.body}</p>
                <p className="mut" style={{ marginTop: 9 }}>{fmtDate(prev.date)}</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
