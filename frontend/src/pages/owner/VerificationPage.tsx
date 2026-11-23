import { useState } from 'react'
import { useLoaderData, useSearchParams, type LoaderFunctionArgs } from 'react-router-dom'
import { getVerification } from '../../api/owner'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate } from '../../utils/format'
import { VER } from '../../utils/labels'

export async function loader({ request }: LoaderFunctionArgs) {
  return getVerification(new URL(request.url).searchParams.get('site'))
}

const DOC_STATUS: Record<string, [string, string]> = { approved: ['bg ok', 'Approved'], pending: ['bg wa', 'Pending'], rejected: ['bg er', 'Rejected'] }

export default function OwnerVerificationPage() {
  const { sites, site, request, nextReconfirmation } = useLoaderData<typeof loader>()
  const [, setParams] = useSearchParams()
  const { notConnected, toast } = useFeedback()
  const [form, setForm] = useState({ type: '', ref: '', note: '' })
  const status = request?.status ?? 'none'
  const reviewed = status === 'approved' || status === 'rejected'

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Verification documents</h1><p className="mut" style={{ marginTop: 6 }}>Submit documents so an administrator can approve your campsite and show the approved badge.</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 240px' }}><span className="lbl">Campsite</span>
            <select className="inp" value={site.id} onChange={(e) => setParams({ site: e.target.value }, { preventScrollReset: true })}>
              {sites.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 520px' }}>
          <div className="card pad24">
            <div className="sec"><h3>Current status</h3><span className={`${VER[status][0]} mla`} style={{ marginLeft: 'auto' }}>{VER[status][1]}</span></div>
            <div className="kv" style={{ marginTop: 4 }}>
              <span className="k">Campsite</span><span><b>{site.name}</b></span>
              <span className="k">Last submission</span><span>{request ? fmtDate(request.date) : 'Never submitted'}</span>
              <span className="k">Reviewed by</span><span>{reviewed ? 'Vo Quoc Dat (administrator)' : 'Not reviewed yet'}</span>
              <span className="k">Next re-confirmation</span><span>{status === 'approved' ? fmtDate(nextReconfirmation) : 'After approval'}</span>
            </div>
            {status === 'rejected' && (
              <>
                <div className="ermsg" style={{ marginTop: 14 }}><b>Administrator feedback:</b> {request?.reason}</div>
                <button className="btn p" style={{ marginTop: 12 }} onClick={notConnected}>Resubmit documents</button>
              </>
            )}
            {status === 'pending' && <div className="okmsg" style={{ marginTop: 14 }}>Your documents are with an administrator. You will be notified when a decision is made — usually within 3 working days.</div>}
            {status === 'approved' && <div className="okmsg" style={{ marginTop: 14 }}>This campsite is approved. Keep it current by confirming it is still active every three months.</div>}
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Submit a document</h3>
            <div className="col" style={{ gap: 14, marginTop: 14 }}>
              <div className="fld"><span className="lbl">Document type *</span>
                <select className="inp" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="">Select a document type</option>
                  <option value="Business registration">Business registration</option>
                  <option value="Land use document">Land use document</option>
                  <option value="Fire safety certificate">Fire safety certificate</option>
                  <option value="Owner identity document">Owner identity document</option>
                  <option value="Environmental permit">Environmental permit</option>
                </select>
              </div>
              <div className="fld"><span className="lbl">Reference / number</span><input className="inp" type="text" placeholder="e.g. 0312-LD-2026" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} /></div>
              <div className="fld"><span className="lbl">Notes for the administrator</span><textarea className="inp" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}></textarea></div>
              <div className="up"><b>Upload the file</b><span className="mut">PDF, JPG or PNG up to 10 MB</span>
                <button className="btn s" onClick={notConnected}>Choose file</button><span className="mut">No file chosen</span></div>
              <div className="row">
                <button className="btn p" onClick={notConnected}>Submit for verification</button>
                <button className="btn g" onClick={() => setForm({ type: '', ref: '', note: '' })}>Clear form</button>
              </div>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Uploaded documents</h3>
            <div className="col" style={{ gap: 10, marginTop: 14 }}>
              {(request?.docs ?? []).map((d) => (
                <div key={d.name} className="doc">
                  <span className="fi">{d.ext}</span>
                  <span style={{ flex: '1 1 180px', minWidth: 0 }}><b>{d.name}</b><div className="mut">{d.meta}</div></span>
                  <span className={DOC_STATUS[d.status][0]}>{DOC_STATUS[d.status][1]}</span>
                  <button className="btn s" onClick={() => toast(`Preview of ${d.name} is not connected to the backend yet`)}>Preview</button>
                </div>
              ))}
              {!request?.docs.length && (
                <div className="empty"><span className="ic">📄</span><h4>No documents yet</h4><p className="mut">Submit your first document to request the approved badge.</p></div>
              )}
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 310px' }}>
          <div className="card pad24">
            <h3>What administrators check</h3>
            <ul className="mut" style={{ margin: '12px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
              <li>The document is valid and readable</li>
              <li>Names match the owner account</li>
              <li>The address matches the listing</li>
              <li>Fire safety and capacity are plausible</li>
            </ul>
            <div className="hr"></div>
            <h4>Status meanings</h4>
            <div className="col" style={{ gap: 8, marginTop: 10 }}>
              <div className="row" style={{ gap: 8 }}><span className="bg wa">Pending</span><span className="mut">With an administrator</span></div>
              <div className="row" style={{ gap: 8 }}><span className="bg ok">Approved</span><span className="mut">Badge shown to campers</span></div>
              <div className="row" style={{ gap: 8 }}><span className="bg er">Rejected</span><span className="mut">Fix and resubmit</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
