import { useLoaderData, useNavigate, useSearchParams, type LoaderFunctionArgs } from 'react-router-dom'
import { getCheckinDesk } from '../../api/owner'
import { BookingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { addDays, fmtDate, initials } from '../../utils/format'

export async function loader({ request }: LoaderFunctionArgs) {
  const date = new URL(request.url).searchParams.get('date') ?? addDays(0)
  return { ...(await getCheckinDesk(date)), date }
}

const step = (done: boolean, yes: string, no: string, pending = 'bg mu') => <span className={done ? 'bg ok' : pending} style={{ marginTop: 6 }}>{done ? yes : no}</span>

export default function CheckInPage() {
  const { bookings, siteCount, date } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()
  const { notConnected } = useFeedback()

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Check-in &amp; check-out</h1><p className="mut" style={{ marginTop: 6 }}>{bookings.length} bookings around {fmtDate(date)} across {siteCount} campsites</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 200px' }}><span className="lbl">Date</span>
            <input className="inp" type="date" value={date} onChange={(e) => setParams({ date: e.target.value }, { preventScrollReset: true })} />
          </div>
        </div>
      </div>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        <div className="card stat"><span className="k">Arriving</span><span className="v">{bookings.filter((b) => b.from === date).length}</span><span className="t">Confirmed for this date</span></div>
        <div className="card stat"><span className="k">Waiting for check-in</span><span className="v" style={{ color: 'var(--warn)' }}>{bookings.filter((b) => b.arrived && !b.checkedIn).length}</span><span className="t">Camper confirmed arrival</span></div>
        <div className="card stat"><span className="k">Currently on site</span><span className="v">{bookings.filter((b) => b.status === 'checkedin').length}</span><span className="t">Checked in</span></div>
        <div className="card stat"><span className="k">Completed stays</span><span className="v">{bookings.filter((b) => b.status === 'completed').length}</span><span className="t">Review now possible</span></div>
      </div>
      <div className="card pad24" style={{ marginBottom: 20 }}>
        <h3>How the flow works</h3>
        <div className="tl" style={{ marginTop: 14 }}>
          <div className="it dn"><span className="dot"></span><div><div className="tx"><b>1. Camper confirms arrival</b></div><div className="tm">From their booking details on the day of arrival.</div></div></div>
          <div className="it dn"><span className="dot"></span><div><div className="tx"><b>2. Owner confirms the check-in</b></div><div className="tm">You verify the camper is on site. The stay becomes active.</div></div></div>
          <div className="it dn"><span className="dot"></span><div><div className="tx"><b>3. Camper confirms check-out</b></div><div className="tm">After the stay. Capacity is released for the following nights.</div></div></div>
          <div className="it dn"><span className="dot"></span><div><div className="tx"><b>4. Stay completed — review unlocked</b></div><div className="tm">The camper can leave exactly one verified review for that booking.</div></div></div>
        </div>
      </div>
      {bookings.length > 0 ? (
        <div className="col" style={{ gap: 14 }}>
          {bookings.map((b) => (
            <div key={b.id} className="card pad24">
              <div className="sec" style={{ marginBottom: 10 }}>
                <div className="row" style={{ gap: 11 }}><span className="av">{initials(b.camper.name)}</span><div><b>{b.camper.name}</b><div className="mut">{b.site.name} · {b.ref} · {b.guests} guests</div></div></div>
                <div className="row mla" style={{ marginLeft: 'auto' }}><BookingBadge status={b.status} /><span className="mut">{fmtDate(b.from)} → {fmtDate(b.to)}</span></div>
              </div>
              <div className="grid g4" style={{ gap: 12 }}>
                <div className="card pad" style={{ boxShadow: 'none' }}><div className="mut">Camper arrival</div>{step(b.arrived, 'Confirmed', 'Waiting')}</div>
                <div className="card pad" style={{ boxShadow: 'none' }}><div className="mut">Owner check-in</div>{step(b.checkedIn, 'Checked in', 'Not yet')}</div>
                <div className="card pad" style={{ boxShadow: 'none' }}><div className="mut">Camper check-out</div>{step(b.checkedOut, 'Confirmed', 'Not yet')}</div>
                <div className="card pad" style={{ boxShadow: 'none' }}><div className="mut">Stay</div>{step(b.status === 'completed', 'Completed', 'In progress', 'bg in')}</div>
              </div>
              <div className="row" style={{ marginTop: 14, gap: 9 }}>
                <button className="btn s" onClick={() => navigate(`/owner/bookings/${b.id}`)}>Booking details</button>
                {b.actions.checkin && <button className="btn p s" onClick={notConnected}>Confirm check-in</button>}
                {b.actions.complete && <button className="btn a s" onClick={notConnected}>Mark stay completed</button>}
                {!b.arrived && b.status === 'confirmed' && <span className="mut">Waiting for the camper to confirm arrival.</span>}
                {b.checkedIn && !b.checkedOut && <span className="mut">Waiting for the camper to confirm check-out.</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty"><span className="ic">⛺</span><h3>Nothing scheduled around this date</h3><p className="mut">Pick another date, or check your confirmed bookings.</p><button className="btn" onClick={() => navigate('/owner/bookings')}>Booking management</button></div>
      )}
    </div>
  )
}
