import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { listAllCampsites } from '../../api/admin'
import { ListingBadge, VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { vnd } from '../../utils/format'

export async function loader() {
  return { sites: await listAllCampsites() }
}

export default function AdminCampsitesPage() {
  const { sites } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { confirm } = useFeedback()
  const [f, setF] = useState({ q: '', lst: 'all', ver: 'all' })
  const list = sites.filter((s) => (!f.q || `${s.name} ${s.owner} ${s.prov}`.toLowerCase().includes(f.q.toLowerCase()))
    && (f.lst === 'all' || s.listing === f.lst) && (f.ver === 'all' || s.ver === f.ver))

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Campsite management</h1>
          <p className="mut" style={{ marginTop: 6 }}>{sites.length} campsites · {sites.filter((s) => s.ver === 'approved').length} approved · {sites.filter((s) => s.listing === 'hidden').length} hidden</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 210px' }}><input className="inp" type="search" placeholder="Campsite, owner or province" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} /></div>
          <div className="fld" style={{ flex: '0 0 160px' }}>
            <select className="inp" value={f.lst} onChange={(e) => setF({ ...f, lst: e.target.value })}>
              <option value="all">All listings</option><option value="listed">Listed</option><option value="draft">Draft</option><option value="hidden">Hidden</option>
            </select>
          </div>
          <div className="fld" style={{ flex: '0 0 170px' }}>
            <select className="inp" value={f.ver} onChange={(e) => setF({ ...f, ver: e.target.value })}>
              <option value="all">All verification</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option><option value="none">Not submitted</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Campsite</th><th>Owner</th><th>Location</th><th>Price</th><th>Capacity</th><th>Listing</th><th>Verification</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td><div className="row" style={{ gap: 10 }}><span className="ph" style={{ background: s.hue, width: 52, height: 38, borderRadius: 7, flex: '0 0 52px' }}></span>
                  <span><b>{s.name}</b><div className="mut">★ {s.rating.toFixed(1)} · {s.nrev} reviews</div></span></div></td>
                <td>{s.owner}</td>
                <td>{s.prov}<div className="mut">{s.addr}</div></td>
                <td>{vnd(s.price)}</td>
                <td>{s.cap}</td>
                <td><ListingBadge listing={s.listing} /></td>
                <td><VerBadge ver={s.ver} /></td>
                <td><div className="ac">
                  <button className="btn s" onClick={() => navigate(`/campsites/${s.id}`)}>View</button>
                  <button className="btn s" onClick={() => confirm(s.listing === 'listed'
                    ? { title: `Hide ${s.name}?`, body: 'It disappears from search and the map until listed again.', ok: 'Hide listing', danger: true }
                    : { title: `List ${s.name}?`, body: 'It becomes visible to campers again.', ok: 'List campsite' })}>{s.listing === 'listed' ? 'Hide' : 'List'}</button>
                  <button className="btn s" onClick={() => navigate('/admin/verification')}>Verification</button>
                  <button className="btn d s" onClick={() => confirm({ title: `Delete ${s.name}?`, body: 'The listing is permanently removed from the platform. This cannot be undone.', ok: 'Delete campsite', danger: true })}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && (
        <div className="card empty"><span className="ic">⛺</span><h3>No campsite matches these filters</h3><button className="btn" onClick={() => setF({ q: '', lst: 'all', ver: 'all' })}>Clear filters</button></div>
      )}
    </div>
  )
}
