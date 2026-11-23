import { useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams, type LoaderFunctionArgs } from 'react-router-dom'
import { getOwnerAvailability } from '../../api/owner'
import { BookingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { WEEKDAYS, currentMonth, fmtDate, leadingBlanks, monthTitle, shiftMonth } from '../../utils/format'

export async function loader({ request }: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams
  const month = params.get('month') ?? currentMonth()
  return { ...(await getOwnerAvailability(params.get('site'), month)), month }
}

export default function AvailabilityPage() {
  const { sites, site, days, closedCount, bookings, month } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { notConnected } = useFeedback()
  const [selDate, setSelDate] = useState<string | null>(null)
  const [capDraft, setCapDraft] = useState('')

  const sel = days.find((d) => d.date === selDate)
  const selBookings = sel ? bookings.filter((b) => sel.date >= b.from && sel.date < b.to) : []
  const selStatus: [string, string] = !sel ? ['bg mu', ''] : sel.closed ? ['bg mu', 'Closed by owner'] : sel.left === 0 ? ['bg er', 'Full']
    : sel.left / Math.max(1, sel.cap) < 0.4 ? ['bg wa', 'Limited'] : ['bg ok', 'Available']
  const go = (patch: Record<string, string>) => {
    setSelDate(null)
    setParams({ ...Object.fromEntries(params), ...patch }, { preventScrollReset: true })
  }

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Availability &amp; capacity</h1><p className="mut" style={{ marginTop: 6 }}>Close dates, adjust capacity and see exactly how many guests are already booked.</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 240px' }}><span className="lbl">Campsite</span>
            <select className="inp" value={site.id} onChange={(e) => go({ site: e.target.value })}>
              {sites.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="fld" style={{ flex: '0 0 auto' }}><span className="lbl">Month</span>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn s" onClick={() => go({ month: shiftMonth(month, -1) })}>←</button>
              <button className="btn s" onClick={() => go({ month: shiftMonth(month, 1) })}>→</button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid g4" style={{ marginBottom: 20 }}>
        <div className="card stat"><span className="k">Maximum capacity</span><span className="v">{site.cap}</span><span className="t">Guests per night</span></div>
        <div className="card stat"><span className="k">Booked this month</span><span className="v">{days.reduce((n, d) => n + d.booked, 0)}</span><span className="t">Guest-nights confirmed or pending</span></div>
        <div className="card stat"><span className="k">Closed dates</span><span className="v">{closedCount}</span><span className="t">Marked unavailable by you</span></div>
        <div className="card stat"><span className="k">Nights at full capacity</span><span className="v">{days.filter((d) => d.kind === 'full').length}</span><span className="t">No further requests accepted</span></div>
      </div>
      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 560px' }}>
          <div className="card pad24">
            <div className="sec"><h3>{monthTitle(month)} · {site.name}</h3><span className="sub">Select a date to manage it</span></div>
            <div className="cal">
              {WEEKDAYS.map((w) => <div key={w} className="hd">{w}</div>)}
              {Array.from({ length: leadingBlanks(month) }, (_, i) => <button key={`pad${i}`} className="cel pad" disabled></button>)}
              {days.map((d) => (
                <button key={d.date} className={`cel ${d.kind}${d.date === selDate ? ' sel' : ''}`} onClick={() => { setSelDate(d.date); setCapDraft(String(d.cap)) }}>
                  <span className="dd">{d.day}</span>
                  <span style={{ fontSize: 11 }}>{d.closed ? 'Closed' : `${d.booked} / ${d.cap}`}</span>
                  <span className="mut" style={{ fontSize: 11 }}>{d.closed ? '' : d.past ? 'past' : `${d.left} free`}</span>
                </button>
              ))}
            </div>
            <div className="leg">
              <span><i style={{ background: '#F2F9F5', borderColor: '#C9E3D5' }}></i>Available capacity</span>
              <span><i style={{ background: '#FDF6EA', borderColor: '#EBD3B0' }}></i>Limited (over 60% booked)</span>
              <span><i style={{ background: '#FBECEB', borderColor: '#EBC4C1' }}></i>Full — overbooking blocked</span>
              <span><i style={{ background: '#EFEADC', borderStyle: 'dashed' }}></i>Closed by owner / past date</span>
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 330px' }}>
          <div className="card pad24">
            <h3>{sel ? fmtDate(sel.date) : 'No date selected'}</h3>
            {sel ? (
              <>
                <div className="kv" style={{ marginTop: 14 }}>
                  <span className="k">Maximum capacity</span><span><b>{sel.cap} guests</b></span>
                  <span className="k">Booked capacity</span><span>{sel.booked} guests</span>
                  <span className="k">Remaining</span><span><b style={{ color: sel.left === 0 ? '#A8231C' : '#17703F' }}>{sel.left} guests</b></span>
                  <span className="k">Status</span><span><span className={selStatus[0]}>{selStatus[1]}</span></span>
                  <span className="k">Bookings</span><span>{selBookings.length} on this date</span>
                </div>
                <div className="hr"></div>
                <div className="fld"><span className="lbl">Capacity for this date</span>
                  <div className="row" style={{ gap: 8 }}>
                    <input className="inp" type="number" min="0" max="500" value={capDraft} onChange={(e) => setCapDraft(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn p" onClick={notConnected}>Update</button>
                  </div>
                  <span className="mut">Cannot be set below {sel.booked} guests already booked.</span>
                </div>
                <div className="col" style={{ gap: 9, marginTop: 14 }}>
                  <button className={sel.closed ? 'btn w p' : 'btn w d'} onClick={notConnected}>{sel.closed ? 'Open this date again' : 'Mark this date unavailable'}</button>
                  <button className="btn w" onClick={() => navigate('/owner/bookings')}>See bookings for this date</button>
                </div>
                <div className="hr"></div>
                <h4>Bookings on this date</h4>
                <div className="col" style={{ gap: 9, marginTop: 10 }}>
                  {selBookings.map((b) => (
                    <div key={b.id} className="row" style={{ gap: 8 }}>
                      <span style={{ flex: '1 1 120px', fontSize: 13.5 }}>{b.camper.name}<div className="mut">{b.guests} guests · {b.ref}</div></span>
                      <BookingBadge status={b.status} />
                    </div>
                  ))}
                  {selBookings.length === 0 && <p className="mut">No bookings on this date yet.</p>}
                </div>
              </>
            ) : (
              <p className="mut" style={{ marginTop: 10 }}>Select a date in the calendar to see its capacity and bookings.</p>
            )}
          </div>
          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Overbooking protection</h3>
            <p className="mut" style={{ marginTop: 8 }}>Requests are checked against remaining capacity for every night of the stay at the moment they are submitted and again when you accept them, so two requests for the last places cannot both be confirmed.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
