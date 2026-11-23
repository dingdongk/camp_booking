import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { listReports } from '../../api/admin'
import { useFeedback } from '../../components/ui/Feedback'
import type { Report } from '../../types/models'
import { fmtDate } from '../../utils/format'

export async function loader() {
  return { reports: await listReports() }
}

const TABS = [['pending', 'New'], ['info', 'Awaiting information'], ['resolved', 'Resolved'], ['rejected', 'Rejected'], ['all', 'All']] as const
const STATUS: Record<Report['status'], [string, string]> = {
  pending: ['bg wa', 'New'], info: ['bg in', 'Awaiting information'], resolved: ['bg ok', 'Resolved'], rejected: ['bg er', 'Rejected'],
}

export default function ReportsPage() {
  const { reports } = useLoaderData<typeof loader>()
  const { notConnected, confirm } = useFeedback()
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('pending')
  const [cat, setCat] = useState('all')
  const [selId, setSelId] = useState<string | null>(reports[0]?.id ?? null)
  const [note, setNote] = useState('')
  const list = reports.filter((r) => (cat === 'all' || r.cat === cat) && (tab === 'all' || r.status === tab))
  const sel = reports.find((r) => r.id === selId)
  const open = reports.filter((r) => r.status === 'pending' || r.status === 'info').length

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Reports &amp; complaints</h1><p className="mut" style={{ marginTop: 6 }}>{open} open · {reports.length} reports in total</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 210px' }}>
            <select className="inp" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="all">All categories</option><option value="Inactive campsite">Inactive campsite</option><option value="Overcrowding">Overcrowding</option>
              <option value="Inaccurate information">Inaccurate information</option><option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([key, label]) => <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label} ({reports.filter((r) => key === 'all' || r.status === key).length})</button>)}
      </div>
      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 420px' }}>
          <div className="col" style={{ gap: 14 }}>
            {list.map((r) => (
              <div key={r.id} className="card pad24">
                <div className="sec" style={{ marginBottom: 8 }}>
                  <div className="row" style={{ gap: 9 }}><span className="bg in">{r.cat}</span><b>{r.siteName}</b></div>
                  <div className="row mla" style={{ marginLeft: 'auto' }}><span className={STATUS[r.status][0]}>{STATUS[r.status][1]}</span></div>
                </div>
                <p className="mut">Reported by {r.reporter} · {fmtDate(r.date)} · {r.ref}</p>
                <p style={{ marginTop: 8 }}>{r.text}</p>
                <div className="row" style={{ marginTop: 12, gap: 9 }}>
                  <span className="pill">Evidence: {r.file}</span>
                  <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => setSelId(r.id)}>Review details</button>
                </div>
              </div>
            ))}
            {list.length === 0 && <div className="card empty"><span className="ic">✓</span><h3>Nothing to action</h3><p className="mut">No reports in this tab.</p></div>}
          </div>
        </div>
        <aside style={{ flex: '0 0 400px' }}>
          <div className="card pad24">
            <h3>Report details</h3>
            {sel ? (
              <>
                <div className="kv" style={{ marginTop: 14 }}>
                  <span className="k">Reference</span><span><b>{sel.ref}</b></span>
                  <span className="k">Category</span><span>{sel.cat}</span>
                  <span className="k">Campsite</span><span>{sel.siteName}</span>
                  <span className="k">Owner</span><span>{sel.owner}</span>
                  <span className="k">Reporter</span><span>{sel.reporter} · {sel.reporterEmail}</span>
                  <span className="k">Submitted</span><span>{fmtDate(sel.date)}</span>
                  <span className="k">Status</span><span><span className={STATUS[sel.status][0]}>{STATUS[sel.status][1]}</span></span>
                </div>
                <div className="hr"></div>
                <h4>Description</h4>
                <p style={{ marginTop: 7 }}>{sel.text}</p>
                <div className="prev" style={{ height: 150, marginTop: 12 }}><b>{sel.file}</b><span className="mut">Submitted evidence — available once file storage is connected</span></div>
                <div className="hr"></div>
                <div className="fld"><span className="lbl">Administrator note</span>
                  <textarea className="inp" placeholder="What action did you take? This is shown to the reporter." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                </div>
                <div className="col" style={{ gap: 9, marginTop: 12 }}>
                  <button className="btn p w" onClick={notConnected}>Resolve report</button>
                  <button className="btn w" onClick={notConnected}>Request further information</button>
                  <button className="btn d w" onClick={notConnected}>Reject report</button>
                  <button className="btn g w" onClick={() => confirm({ title: `Hide ${sel.siteName}?`, body: 'It disappears from search and the map until listed again.', ok: 'Hide listing', danger: true })}>Hide the campsite listing</button>
                </div>
              </>
            ) : (
              <p className="mut" style={{ marginTop: 10 }}>Select a report to see its evidence and take action.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
