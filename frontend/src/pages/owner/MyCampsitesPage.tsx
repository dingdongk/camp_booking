import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { listOwnerCampsites } from '../../api/owner'
import { ListingBadge, VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate, vnd } from '../../utils/format'

export async function loader() {
  return listOwnerCampsites()
}

export default function MyCampsitesPage() {
  const { sites, confirmedCount, lastConfirmed } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { confirm } = useFeedback()
  const [q, setQ] = useState('')
  const approved = sites.filter((s) => s.ver === 'approved').length
  // Text match on already-loaded rows is display-only; the backend will own real search.
  const list = sites.filter((s) => !q || `${s.name} ${s.prov} ${s.addr}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>My campsites</h1><p className="mut" style={{ marginTop: 6 }}>{sites.length} campsites · {approved} approved · {confirmedCount} confirmed bookings</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 180px' }}><input className="inp" type="search" placeholder="Search my campsites" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <button className="btn p" onClick={() => navigate('/owner/campsites/new')}>Create new campsite</button>
        </div>
      </div>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>Campsite</th><th>Location</th><th>Price / night</th><th>Capacity</th><th>Listing</th><th>Verification</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td><div className="row" style={{ gap: 10 }}><span className="ph" style={{ background: s.hue, width: 54, height: 40, borderRadius: 7, flex: '0 0 54px' }}></span>
                  <span><b>{s.name}</b><div className="mut">{s.cat}</div></span></div></td>
                <td>{s.prov}<div className="mut">{s.addr}</div></td>
                <td><b>{vnd(s.price)}</b></td>
                <td>{s.cap} guests<div className="mut">{s.bookedTonight} booked tonight</div></td>
                <td><ListingBadge listing={s.listing} /></td>
                <td><VerBadge ver={s.ver} /></td>
                <td><span className={s.active ? 'bg ok' : 'bg mu'}>{s.active ? 'Active' : 'Inactive'}</span></td>
                <td><div className="ac">
                  <button className="btn s" onClick={() => navigate(`/owner/campsites/${s.id}/edit`)}>Edit</button>
                  <button className="btn s" onClick={() => navigate(`/campsites/${s.id}`)}>View</button>
                  <button className="btn s" onClick={() => navigate(`/owner/availability?site=${s.id}`)}>Calendar</button>
                  <button className="btn s" onClick={() => confirm(s.active
                    ? { title: `Deactivate ${s.name}?`, body: 'Campers will not be able to send new requests. Confirmed bookings are unaffected.', ok: 'Deactivate', danger: true }
                    : { title: `Activate ${s.name}?`, body: 'The campsite becomes bookable again from today.', ok: 'Activate' })}>{s.active ? 'Deactivate' : 'Activate'}</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && (
        <div className="card empty"><span className="ic">⛺</span><h3>No campsite matches that search</h3><button className="btn" onClick={() => setQ('')}>Clear search</button></div>
      )}
      <div className="card pad24" style={{ marginTop: 20, background: '#FDF6EA', borderColor: '#EBD3B0' }}>
        <div className="sec"><h3>Three-month activity confirmation</h3><span className="sub">Keeps your approved badge and map marker accurate</span></div>
        <div className="row">
          <p className="lead" style={{ flex: '1 1 320px' }}>Last confirmed {fmtDate(lastConfirmed)}. The next confirmation is due in about four weeks; campsites that are not confirmed lose the approved badge.</p>
          <button className="btn a" onClick={() => confirm({ title: 'Confirm all campsites are active?', body: 'Each campsite keeps its approved badge for another three months.', ok: 'Confirm' })}>Confirm all campsites are active</button>
        </div>
      </div>
    </div>
  )
}
