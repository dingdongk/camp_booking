import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { listMyBookings } from '../../api/bookings'
import { ReviewDialog } from '../../components/booking/ReviewDialog'
import { BookingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import type { BookingView } from '../../types/models'
import { addDays, fmtDate, vnd } from '../../utils/format'

export async function loader() {
  return { bookings: await listMyBookings() }
}

const TABS = [['all', 'All'], ['upcoming', 'Upcoming'], ['pending', 'Pending'], ['confirmed', 'Confirmed'], ['past', 'Past'], ['cancelled', 'Cancelled'], ['rejected', 'Rejected'], ['completed', 'Completed']] as const
type Tab = (typeof TABS)[number][0]

function inTab(b: BookingView, tab: Tab) {
  const today = addDays(0)
  if (tab === 'all') return true
  if (tab === 'confirmed') return ['confirmed', 'arrived', 'checkedin'].includes(b.status)
  if (tab === 'upcoming') return ['confirmed', 'arrived', 'checkedin', 'pending'].includes(b.status) && b.to >= today
  if (tab === 'past') return b.to < today || b.status === 'completed'
  return b.status === tab
}

export default function MyBookingsPage() {
  const { bookings } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected, confirm } = useFeedback()
  const [tab, setTab] = useState<Tab>('all')
  const [reviewing, setReviewing] = useState<BookingView | null>(null)
  const list = bookings.filter((b) => inTab(b, tab))
  const upcoming = bookings.filter((b) => ['confirmed', 'arrived', 'checkedin'].includes(b.status)).length
  const completed = bookings.filter((b) => b.status === 'completed').length

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>My bookings</h1><p className="mut" style={{ marginTop: 6 }}>{bookings.length} bookings in total · {upcoming} upcoming · {completed} completed</p></div>
        <button className="btn p s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/search')}>New booking</button>
      </div>
      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label} ({bookings.filter((b) => inTab(b, key)).length})</button>
        ))}
      </div>
      {list.length > 0 ? (
        <div className="col" style={{ gap: 14 }}>
          {list.map((b) => (
            <div key={b.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 14, alignItems: 'center' }}>
              <span className="ph" style={{ background: b.site.hue, width: 132, height: 96, borderRadius: 11, flex: '0 0 132px' }}><span className="pl">{b.site.prov}</span></span>
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <div className="row" style={{ gap: 9 }}><b style={{ fontSize: 16 }}>{b.site.name}</b><BookingBadge status={b.status} /></div>
                <div className="mut" style={{ marginTop: 4 }}>{b.site.addr} · {b.site.prov}</div>
                <div className="kv" style={{ marginTop: 9, gridTemplateColumns: 'auto auto', gap: '3px 14px' }}>
                  <span className="k">Reference</span><span>{b.ref}</span>
                  <span className="k">Dates</span><span>{fmtDate(b.from)} → {fmtDate(b.to)} ({b.nights} nights)</span>
                  <span className="k">Guests</span><span>{b.guests}</span>
                  <span className="k">Total</span><span>{vnd(b.total)} — on site</span>
                </div>
              </div>
              <div className="col" style={{ flex: '0 0 190px', gap: 8 }}>
                <button className="btn s w" onClick={() => navigate(`/me/bookings/${b.id}`)}>View details</button>
                {b.actions.cancel && (
                  <button className="btn d s w" onClick={() => confirm({ title: `Cancel booking ${b.ref}?`, body: `Your stay at ${b.site.name} is cancelled and the places are released.`, ok: 'Cancel booking', danger: true })}>Cancel booking</button>
                )}
                {b.actions.arrive && <button className="btn p s w" onClick={notConnected}>Confirm arrival</button>}
                {b.actions.checkout && <button className="btn p s w" onClick={notConnected}>Confirm check-out</button>}
                {b.actions.review && <button className="btn a s w" onClick={() => setReviewing(b)}>Write a review</button>}
                {b.actions.rebook && <button className="btn s w" onClick={() => navigate(`/campsites/${b.siteId}`)}>Book again</button>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty"><span className="ic">⛺</span><h3>Nothing in this tab</h3><p className="mut">No bookings with this status yet.</p><button className="btn p" onClick={() => navigate('/search')}>Find a campsite</button></div>
      )}
      {reviewing && <ReviewDialog site={reviewing.site.name} dates={`${fmtDate(reviewing.from)} → ${fmtDate(reviewing.to)}`} onClose={() => setReviewing(null)} />}
    </div>
  )
}
