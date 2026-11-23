import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { listVerificationRequests } from '../../api/admin'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate } from '../../utils/format'
import { VER } from '../../utils/labels'

export async function loader() {
  return { requests: await listVerificationRequests() }
}

const TABS = [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All requests']] as const
const stCls = (s: string) => (s === 'approved' ? 'bg ok' : s === 'pending' ? 'bg wa' : 'bg er')

export default function AdminVerificationPage() {
  const { requests } = useLoaderData<typeof loader>()
  const { notConnected, toast } = useFeedback()
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('pending')
  const [selId, setSelId] = useState<string | null>(requests.find((v) => v.status === 'pending')?.id ?? null)
  const [docIdx, setDocIdx] = useState(0)
  const [reason, setReason] = useState('')
  const list = requests.filter((v) => tab === 'all' || v.status === tab)
  const sel = requests.find((v) => v.id === selId)
  const doc = sel?.docs[Math.min(docIdx, sel.docs.length - 1)]

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Campsite verification</h1>
          <p className="mut" style={{ marginTop: 6 }}>{requests.filter((v) => v.status === 'pending').length} requests pending · {requests.filter((v) => v.status === 'approved').length} approved in total</p></div>
      </div>
      <div className="tabs">
        {TABS.map(([key, label]) => <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label} ({requests.filter((v) => key === 'all' || v.status === key).length})</button>)}
      </div>
      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 420px' }}>
          <div className="col" style={{ gap: 14 }}>
            {list.map((v) => (
              <div key={v.id} className="card pad24">
                <div className="sec" style={{ marginBottom: 8 }}>
                  <div><h4>{v.siteName}</h4><div className="mut" style={{ marginTop: 3 }}>{v.ownerName} · {v.prov} · submitted {fmtDate(v.date)}</div></div>
                  <div className="row mla" style={{ marginLeft: 'auto' }}><span className={stCls(v.status)}>{VER[v.status][1]}</span></div>
                </div>
                <div className="row" style={{ gap: 9 }}>
                  {v.docs.map((d) => <span key={d.name} className="pill">{d.ext} · {d.name.replace(/\.[a-z]+$/, '')}</span>)}
                </div>
                <div className="row" style={{ marginTop: 12, gap: 9 }}>
                  <button className="btn s" onClick={() => { setSelId(v.id); setDocIdx(0) }}>Open documents</button>
                  {v.status === 'pending' && (
                    <>
                      <button className="btn p s" onClick={notConnected}>Approve</button>
                      <button className="btn d s" onClick={() => { setSelId(v.id); toast('Give a rejection reason in the panel, then confirm') }}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {list.length === 0 && <div className="card empty"><span className="ic">✓</span><h3>Queue is clear</h3><p className="mut">No verification requests in this tab.</p></div>}
          </div>
        </div>
        <aside style={{ flex: '0 0 420px' }}>
          <div className="card pad24">
            <h3>Document review</h3>
            {sel ? (
              <>
                <div className="kv" style={{ marginTop: 14 }}>
                  <span className="k">Campsite</span><span><b>{sel.siteName}</b></span>
                  <span className="k">Owner</span><span>{sel.ownerName}</span>
                  <span className="k">Contact</span><span>{sel.ownerEmail}</span>
                  <span className="k">Submitted</span><span>{fmtDate(sel.date)}</span>
                  <span className="k">Status</span><span><span className={stCls(sel.status)}>{VER[sel.status][1]}</span></span>
                </div>
                <div className="hr"></div>
                <div className="row" style={{ gap: 7 }}>
                  {sel.docs.map((d, i) => <button key={d.name} className={i === docIdx ? 'btn s p' : 'btn s'} onClick={() => setDocIdx(i)}>{d.ext} {i + 1}</button>)}
                </div>
                {doc && (
                  <div className="prev" style={{ marginTop: 12 }}>
                    <span className="fi" style={{ width: 44, height: 54, borderRadius: 6, background: '#E8F1F7', border: '1px solid #C2D8E6', color: '#1A587F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>{doc.ext}</span>
                    <b>{doc.name}</b>
                    <span className="mut">{doc.meta}</span>
                    <span className="mut">Document preview — available once file storage is connected</span>
                  </div>
                )}
                <div className="col" style={{ gap: 9, marginTop: 14 }}>
                  {sel.status === 'pending' ? (
                    <>
                      <button className="btn p w" onClick={notConnected}>Approve verification</button>
                      <div className="fld"><span className="lbl">Rejection reason (required to reject)</span>
                        <textarea className="inp" placeholder="Explain what is missing or unclear so the owner can resubmit." value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                      </div>
                      <button className="btn d w" onClick={notConnected}>Reject verification</button>
                    </>
                  ) : (
                    <>
                      <div className={sel.status === 'approved' ? 'okmsg' : 'ermsg'}>{sel.status === 'approved' ? 'Approved — the campsite shows the approved badge.' : `Rejected: ${sel.reason}`}</div>
                      <button className="btn w" onClick={notConnected}>Return to pending</button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="mut" style={{ marginTop: 10 }}>Select a request to preview its documents.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
