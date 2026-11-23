import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { listMySiteOptions, listOwnerBookings } from '../../api/owner'
import { BookingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import type { BookingView } from '../../types/models'
import { fmtDate, initials } from '../../utils/format'

export async function loader() {
  const [bookings, sites] = await Promise.all([listOwnerBookings(), listMySiteOptions()])
  return { bookings, sites }
}

const TABS = [['pending', 'Pending'], ['confirmed', 'Confirmed'], ['completed', 'Completed'], ['rejected', 'Rejected'], ['cancelled', 'Cancelled'], ['all', 'All']] as const
type Tab = (typeof TABS)[number][0]

function inTab(b: BookingView, t: Tab) {
  if (t === 'all') return true
  if (t === 'confirmed') return ['confirmed', 'arrived', 'checkedin'].includes(b.status)
  return b.status === t
}

export default function BookingsPage() {
  const { bookings, sites } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected, confirm } = useFeedback()
  const [tab, setTab] = useState<Tab>('pending')
  const [q, setQ] = useState('')
  const [siteId, setSiteId] = useState('all')
  const pending = bookings.filter((b) => b.status === 'pending').length
  const list = bookings.filter((b) => inTab(b, tab) && (siteId === 'all' || b.siteId === siteId)
    && (!q || `${b.ref} ${b.camper.name} ${b.site.name}`.toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Booking management</h1><p className="mut" style={{ marginTop: 6 }}>{bookings.length} bookings across your campsites · {pending} awaiting your decision</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 200px' }}><input className="inp" type="search" placeholder="Camper, reference, campsite" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="fld" style={{ flex: '0 0 190px' }}>
            <select className="inp" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              <option value="all">All campsites</option>
              {sites.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="tabs">
        {TABS.map(([key, label]) => <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label} ({bookings.filter((b) => inTab(b, key)).length})</button>)}
      </div>
      {list.length > 0 ? (
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Reference</th><th>Camper</th><th>Campsite</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id}>
                  <td><b>{b.ref}</b><div className="mut">Requested {fmtDate(b.created)}</div></td>
                  <td><div className="row" style={{ gap: 9 }}><span className="av" style={{ width: 30, height: 30, fontSize: 11 }}>{initials(b.camper.name)}</span><span><b>{b.camper.name}</b><div className="mut">{b.camper.phone}</div></span></div></td>
                  <td>{b.site.name}<div className="mut">{b.site.prov}</div></td>
                  <td>{fmtDate(b.from)}</td><td>{fmtDate(b.to)}</td>
                  <td>{b.guests}<div className="mut">{b.nights} nights</div></td>
                  <td><BookingBadge status={b.status} /></td>
                  <td><div className="ac">
                    <button className="btn s" onClick={() => navigate(`/owner/bookings/${b.id}`)}>Details</button>
                    {b.status === 'pending' && (
                      <>
                        <button className="btn p s" onClick={() => confirm({ title: `Accept ${b.ref}?`, body: `${b.guests} guests at ${b.site.name}, ${fmtDate(b.from)} → ${fmtDate(b.to)}.`, ok: 'Accept' })}>Accept</button>
                        <button className="btn d s" onClick={() => confirm({ title: `Reject ${b.ref}?`, body: `${b.camper.name} is told the campsite cannot take this booking.`, ok: 'Reject', danger: true })}>Reject</button>
                      </>
                    )}
                    {b.actions.checkin && <button className="btn p s" onClick={notConnected}>Check in</button>}
                    {b.actions.complete && <button className="btn a s" onClick={notConnected}>Complete stay</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty"><span className="ic">✉</span><h3>No bookings in this view</h3><p className="mut">No bookings match this tab and filter.</p></div>
      )}
    </div>
  )
}
