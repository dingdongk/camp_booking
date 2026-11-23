import { useState } from 'react'
import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom'
import { getBookingDetail } from '../../api/bookings'
import { ReviewDialog } from '../../components/booking/ReviewDialog'
import { Timeline } from '../../components/booking/Timeline'
import { BookingBadge, VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate, vnd } from '../../utils/format'

export async function loader({ params }: LoaderFunctionArgs) {
  return getBookingDetail(params.id!)
}

export default function BookingDetailPage() {
  const { booking: b, timeline } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected, confirm } = useFeedback()
  const [reviewing, setReviewing] = useState(false)
  const openSite = () => navigate(`/campsites/${b.siteId}`)
  const actionNote = b.status === 'confirmed' ? `Cancellation is free up to 24 hours before ${fmtDate(b.from)}.`
    : b.status === 'completed' && !b.reviewed ? 'This stay is completed — you can leave one verified review.'
    : 'Actions appear as the booking moves through its stages.'

  return (
    <div className="wrap">
      <button className="bk" onClick={() => navigate('/me/bookings')}>← Back to my bookings</button>
      <div className="sec" style={{ marginTop: 8 }}>
        <div><h1 style={{ fontSize: 27 }}>Booking {b.ref}</h1><p className="mut" style={{ marginTop: 6 }}>Requested {fmtDate(b.created)} · {b.site.name}</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}><BookingBadge status={b.status} /></div>
      </div>
      <div className="body" style={{ gap: 24, alignItems: 'flex-start', marginTop: 16 }}>
        <div className="main" style={{ flex: '999 1 520px' }}>
          <div className="card pad24">
            <h3>Booking information</h3>
            <div className="kv" style={{ marginTop: 14 }}>
              <span className="k">Reference</span><span><b>{b.ref}</b></span>
              <span className="k">Status</span><span><BookingBadge status={b.status} /></span>
              <span className="k">Check-in</span><span>{fmtDate(b.from)} · {b.arrival}</span>
              <span className="k">Check-out</span><span>{fmtDate(b.to)}</span>
              <span className="k">Nights</span><span>{b.nights}</span>
              <span className="k">Guests</span><span>{b.guests}</span>
              <span className="k">Equipment</span><span>{b.gear}</span>
              <span className="k">Estimated total</span><span>{vnd(b.total)} — settled on site</span>
              <span className="k">Note to owner</span><span>{b.note || 'No note'}</span>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Booking timeline</h3>
            <Timeline steps={timeline} style={{ marginTop: 14 }} />
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Check-in and check-out</h3>
            <div className="grid g2" style={{ gap: 14, marginTop: 14 }}>
              <div className="card pad" style={{ boxShadow: 'none' }}>
                <div className="row"><b>Arrival</b><span className={`${b.arrived ? 'bg ok' : 'bg mu'} mla`} style={{ marginLeft: 'auto' }}>{b.checkedIn ? 'Checked in' : b.arrived ? 'Arrival confirmed' : 'Not yet confirmed'}</span></div>
                <p className="mut" style={{ marginTop: 7 }}>You confirm you have arrived, then the owner checks you in.</p>
                {b.actions.arrive && <button className="btn p w" style={{ marginTop: 10 }} onClick={notConnected}>Confirm my arrival</button>}
              </div>
              <div className="card pad" style={{ boxShadow: 'none' }}>
                <div className="row"><b>Check-out</b><span className={`${b.checkedOut ? 'bg ok' : 'bg mu'} mla`} style={{ marginLeft: 'auto' }}>{b.status === 'completed' ? 'Stay completed' : b.checkedOut ? 'Camper confirmed' : 'Not yet confirmed'}</span></div>
                <p className="mut" style={{ marginTop: 7 }}>Confirm check-out after your stay to complete the booking.</p>
                {b.actions.checkout && <button className="btn p w" style={{ marginTop: 10 }} onClick={notConnected}>Confirm check-out</button>}
              </div>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Available actions</h3>
            <div className="row" style={{ gap: 10, marginTop: 12 }}>
              {b.actions.cancel && (
                <button className="btn d" onClick={() => confirm({ title: `Cancel booking ${b.ref}?`, body: `Your stay at ${b.site.name} is cancelled and the places are released.`, ok: 'Cancel booking', danger: true })}>Cancel this booking</button>
              )}
              {b.actions.review && <button className="btn a" onClick={() => setReviewing(true)}>Write your review</button>}
              <button className="btn" onClick={openSite}>View campsite</button>
              <button className="btn g" onClick={notConnected}>Report a problem</button>
            </div>
            <p className="mut" style={{ marginTop: 10 }}>{actionNote}</p>
          </div>
        </div>

        <aside style={{ flex: '0 0 330px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="ph" style={{ background: b.site.hue, height: 124 }}><span className="pl">{b.site.prov}</span><div className="tl"><VerBadge ver={b.site.ver} /></div></div>
            <div className="pad24">
              <h4>{b.site.name}</h4>
              <p className="mut" style={{ marginTop: 4 }}>{b.site.addr} · {b.site.prov}</p>
              <div className="star" style={{ marginTop: 6 }}>★ {b.site.rating.toFixed(1)}</div>
              <div className="hr"></div>
              <div className="kv">
                <span className="k">Price</span><span>{vnd(b.site.price)} / night</span>
                <span className="k">Capacity</span><span>{b.site.cap} guests</span>
                <span className="k">Owner</span><span>{b.site.owner}</span>
                <span className="k">Phone</span><span>{b.ownerPhone}</span>
              </div>
              <button className="btn w" style={{ marginTop: 14 }} onClick={openSite}>Open campsite page</button>
            </div>
          </div>
          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Cancellation policy</h3>
            <p className="mut" style={{ marginTop: 8 }}>Confirmed bookings can be cancelled free of charge up to 24 hours before the check-in date. Cancelling releases the capacity back to the campsite immediately.</p>
          </div>
        </aside>
      </div>
      {reviewing && <ReviewDialog site={b.site.name} dates={`${fmtDate(b.from)} → ${fmtDate(b.to)}`} onClose={() => setReviewing(false)} />}
    </div>
  )
}
