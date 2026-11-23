import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom'
import { getBooking } from '../../api/bookings'
import { addDays, fmtDate, vnd } from '../../utils/format'
import { VER } from '../../utils/labels'

export async function loader({ params }: LoaderFunctionArgs) {
  return getBooking(params.id!)
}

export default function BookingConfirmationPage() {
  const b = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  return (
    <div className="wrap" style={{ maxWidth: 780 }}>
      <div className="card pad24" style={{ marginTop: 18, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E6F2EA', border: '1px solid #BBDCC8', color: 'var(--ok)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto' }}>✓</div>
        <h1 style={{ fontSize: 27, marginTop: 14 }}>Booking request sent</h1>
        <p className="lead" style={{ marginTop: 8 }}>{b.site.owner} has been notified and will accept or reject your request. You will see the result in My bookings.</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}><span className="bg wa">Pending owner approval</span><span className="bg mu">Reference {b.ref}</span></div>
      </div>
      <div className="card pad24" style={{ marginTop: 18 }}>
        <h3>Booking summary</h3>
        <div className="row" style={{ gap: 14, marginTop: 14 }}>
          <span className="ph" style={{ background: b.site.hue, width: 110, height: 84, borderRadius: 11, flex: '0 0 110px' }}></span>
          <div><b>{b.site.name}</b><div className="mut">{b.site.addr} · {b.site.prov}</div><div className="mut">{VER[b.site.ver][1]}</div></div>
        </div>
        <div className="hr"></div>
        <div className="kv">
          <span className="k">Reference</span><span><b>{b.ref}</b></span>
          <span className="k">Check-in</span><span>{fmtDate(b.from)}</span>
          <span className="k">Check-out</span><span>{fmtDate(b.to)}</span>
          <span className="k">Nights</span><span>{b.nights}</span>
          <span className="k">Guests</span><span>{b.guests} guests</span>
          <span className="k">Estimated total</span><span>{vnd(b.total)} — paid on site</span>
          <span className="k">Status</span><span><span className="bg wa">Pending</span></span>
        </div>
      </div>
      <div className="card pad24" style={{ marginTop: 18 }}>
        <h3>What happens next</h3>
        <div className="tl" style={{ marginTop: 14 }}>
          <div className="it dn"><span className="dot"></span><div><div className="tx"><b>Request submitted</b></div><div className="tm">{fmtDate(addDays(0))} — capacity is held while the owner reviews</div></div></div>
          <div className="it cu"><span className="dot"></span><div><div className="tx"><b>Owner reviews your request</b></div><div className="tm">Usually within 6 hours. You can cancel at any time while it is pending.</div></div></div>
          <div className="it"><span className="dot"></span><div><div className="tx">Confirmed, then arrival</div><div className="tm">Confirm your arrival on the day, the owner checks you in.</div></div></div>
          <div className="it"><span className="dot"></span><div><div className="tx">Check out and review</div><div className="tm">Once the stay is completed you can leave one verified review.</div></div></div>
        </div>
        <div className="row" style={{ marginTop: 18 }}>
          <button className="btn p" onClick={() => navigate(`/me/bookings/${b.id}`)}>View booking details</button>
          <button className="btn" onClick={() => navigate('/me')}>Go to my dashboard</button>
          <button className="btn g" onClick={() => navigate('/search')}>Keep browsing campsites</button>
        </div>
      </div>
    </div>
  )
}
