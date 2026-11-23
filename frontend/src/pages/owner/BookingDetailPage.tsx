import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom'
import { getBookingDetail } from '../../api/bookings'
import { Timeline } from '../../components/booking/Timeline'
import { BookingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate, initials, vnd } from '../../utils/format'

export async function loader({ params }: LoaderFunctionArgs) {
  return getBookingDetail(params.id!)
}

export default function OwnerBookingDetailPage() {
  const { booking: b, timeline, placesLeft } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected, confirm } = useFeedback()
  const capNote = placesLeft >= b.guests
    ? `${placesLeft} places are free for every night of this stay; accepting leaves ${placesLeft - b.guests}.`
    : `Only ${placesLeft} places are free on at least one night — accepting would overbook the campsite.`

  return (
    <div className="wrap">
      <button className="bk" onClick={() => navigate('/owner/bookings')}>← Back to booking management</button>
      <div className="sec" style={{ marginTop: 8 }}>
        <div><h1 style={{ fontSize: 27 }}>Booking {b.ref}</h1><p className="mut" style={{ marginTop: 6 }}>{b.site.name} · requested {fmtDate(b.created)}</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}><BookingBadge status={b.status} /></div>
      </div>
      <div className="body" style={{ gap: 24, alignItems: 'flex-start', marginTop: 16 }}>
        <div className="main" style={{ flex: '999 1 520px' }}>
          {b.status === 'pending' && (
            <div className="card pad24" style={{ background: '#FDF6EA', borderColor: '#EBD3B0' }}>
              <h3>This request needs your decision</h3>
              <p className="lead" style={{ marginTop: 8 }}>{capNote}</p>
              <div className="row" style={{ marginTop: 14 }}>
                <button className="btn p" onClick={() => confirm({ title: `Accept ${b.ref}?`, body: `${b.guests} guests at ${b.site.name}, ${fmtDate(b.from)} → ${fmtDate(b.to)}.`, ok: 'Accept' })}>Accept request</button>
                <button className="btn d" onClick={() => confirm({ title: `Reject ${b.ref}?`, body: `${b.camper.name} is told the campsite cannot take this booking.`, ok: 'Reject', danger: true })}>Reject request</button>
              </div>
            </div>
          )}
          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Booking information</h3>
            <div className="kv" style={{ marginTop: 14 }}>
              <span className="k">Reference</span><span><b>{b.ref}</b></span>
              <span className="k">Status</span><span><BookingBadge status={b.status} /></span>
              <span className="k">Check-in</span><span>{fmtDate(b.from)} · arriving {b.arrival}</span>
              <span className="k">Check-out</span><span>{fmtDate(b.to)}</span>
              <span className="k">Nights</span><span>{b.nights}</span>
              <span className="k">Guests</span><span>{b.guests}</span>
              <span className="k">Equipment</span><span>{b.gear}</span>
              <span className="k">To collect on site</span><span>{vnd(b.total)}</span>
              <span className="k">Camper note</span><span>{b.note || 'No note'}</span>
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
                <div className="row"><b>Camper arrival</b><span className={`${b.arrived ? 'bg ok' : 'bg mu'} mla`} style={{ marginLeft: 'auto' }}>{b.checkedIn ? 'Checked in' : b.arrived ? 'Arrival confirmed' : 'Not yet confirmed'}</span></div>
                <p className="mut" style={{ marginTop: 7 }}>Confirm the check-in once the camper has arrived on site.</p>
                {b.actions.checkin && <button className="btn p w" style={{ marginTop: 10 }} onClick={notConnected}>Confirm check-in</button>}
              </div>
              <div className="card pad" style={{ boxShadow: 'none' }}>
                <div className="row"><b>Check-out</b><span className={`${b.checkedOut ? 'bg ok' : 'bg mu'} mla`} style={{ marginLeft: 'auto' }}>{b.status === 'completed' ? 'Stay completed' : b.checkedOut ? 'Camper confirmed' : 'Not yet confirmed'}</span></div>
                <p className="mut" style={{ marginTop: 7 }}>The camper confirms check-out; you can complete the stay from here.</p>
                {b.actions.complete && <button className="btn a w" style={{ marginTop: 10 }} onClick={notConnected}>Mark stay completed</button>}
              </div>
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 330px' }}>
          <div className="card pad24">
            <h3>Camper</h3>
            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <span className="av" style={{ width: 46, height: 46, fontSize: 15 }}>{initials(b.camper.name)}</span>
              <div><b>{b.camper.name}</b><div className="mut">Camper since 2025</div></div>
            </div>
            <div className="kv" style={{ marginTop: 14 }}>
              <span className="k">Phone</span><span>{b.camper.phone}</span>
              <span className="k">Email</span><span>{b.camper.email}</span>
              <span className="k">Past stays</span><span>{b.camper.completedStays} completed on VietCamp</span>
            </div>
          </div>
          <div className="card" style={{ marginTop: 18, overflow: 'hidden' }}>
            <div className="ph" style={{ background: b.site.hue, height: 110 }}><span className="pl">{b.site.prov}</span></div>
            <div className="pad24">
              <h4>{b.site.name}</h4>
              <div className="kv" style={{ marginTop: 12 }}>
                <span className="k">Capacity</span><span>{b.site.cap} guests</span>
                <span className="k">Price</span><span>{vnd(b.site.price)} / night</span>
                <span className="k">Remaining that night</span><span>{placesLeft} of {b.site.cap} guests</span>
              </div>
              <button className="btn w" style={{ marginTop: 12 }} onClick={() => navigate(`/owner/availability?site=${b.siteId}`)}>Open calendar</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
