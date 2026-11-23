import { useLoaderData, useNavigate } from 'react-router-dom'
import { getOwnerDashboard } from '../../api/owner'
import { BookingBadge, VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { addDays, fmtDate, initials, nightsBetween } from '../../utils/format'
import { LST, ST } from '../../utils/labels'

export async function loader() {
  return getOwnerDashboard()
}

function arrivalText(from: string) {
  const days = nightsBetween(addDays(0), from)
  return days === 0 ? 'Arriving today' : days === 1 ? 'Arriving tomorrow' : `In ${days} days · ${fmtDate(from)}`
}

export default function OwnerDashboardPage() {
  const d = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { confirm } = useFeedback()
  const active = d.sites.filter((s) => s.active && s.listing === 'listed').length
  const greeting = d.pending.length
    ? `${d.pending.length} booking request${d.pending.length > 1 ? 's' : ''} are waiting for your decision.`
    : 'No requests waiting. Your calendar is up to date.'

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Pine Hill Camping — owner dashboard</h1><p className="mut" style={{ marginTop: 6 }}>{greeting}</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <button className="btn s" onClick={() => navigate('/owner/availability')}>Availability</button>
          <button className="btn p s" onClick={() => navigate('/owner/campsites/new')}>Add a campsite</button>
        </div>
      </div>
      <div className="grid g4" style={{ marginTop: 4 }}>
        <div className="card stat"><span className="k">My campsites</span><span className="v">{d.sites.length}</span><span className="t">{active} active · {d.sites.length - active} inactive</span></div>
        <div className="card stat"><span className="k">Pending requests</span><span className="v" style={{ color: 'var(--warn)' }}>{d.pending.length}</span><span className="t">Waiting for your decision</span></div>
        <div className="card stat"><span className="k">Confirmed bookings</span><span className="v">{d.confirmedCount}</span><span className="t">{d.guestsExpected} guests expected</span></div>
        <div className="card stat"><span className="k">Occupancy this week</span><span className="v">{d.occupancyPct}%</span><span className="t">Of total capacity</span></div>
      </div>

      <div className="body" style={{ gap: 20, alignItems: 'flex-start', marginTop: 20 }}>
        <div className="main" style={{ flex: '999 1 560px' }}>
          {d.pending.length > 0 && (
            <div className="card pad24" style={{ borderColor: '#EBD3B0', background: '#FDF6EA' }}>
              <div className="sec"><h3>Booking requests to review</h3><button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/owner/bookings')}>Open booking management</button></div>
              <div className="col" style={{ gap: 10 }}>
                {d.pending.map((b) => (
                  <div key={b.id} className="card" style={{ boxShadow: 'none', display: 'flex', flexWrap: 'wrap', gap: 12, padding: 12, alignItems: 'center' }}>
                    <span className="av" style={{ flex: '0 0 36px' }}>{initials(b.camper.name)}</span>
                    <div style={{ flex: '1 1 220px' }}>
                      <b>{b.camper.name}</b>
                      <div className="mut">{b.site.name} · {fmtDate(b.from)} → {fmtDate(b.to)} · {b.guests} guests</div>
                      <div className="mut">{b.placesLeft >= b.guests ? `${b.placesLeft} places free on those nights` : `Only ${b.placesLeft} places free — accepting would overbook`}</div>
                    </div>
                    <div className="row" style={{ gap: 8 }}>
                      <button className="btn s" onClick={() => navigate(`/owner/bookings/${b.id}`)}>Details</button>
                      <button className="btn d s" onClick={() => confirm({ title: `Reject ${b.ref}?`, body: `${b.camper.name} is told the campsite cannot take this booking.`, ok: 'Reject', danger: true })}>Reject</button>
                      <button className="btn p s" onClick={() => confirm({ title: `Accept ${b.ref}?`, body: `${b.guests} guests at ${b.site.name}, ${fmtDate(b.from)} → ${fmtDate(b.to)}.`, ok: 'Accept' })}>Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card pad24" style={{ marginTop: 20 }}>
            <div className="sec"><h3>Upcoming arrivals</h3><span className="sub">Confirmed stays starting soon</span>
              <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/owner/check-in')}>Check-in desk</button></div>
            <div className="col" style={{ gap: 10 }}>
              {d.arrivals.map((b) => (
                <div key={b.id} className="row" style={{ gap: 12 }}>
                  <span className="av" style={{ width: 32, height: 32, fontSize: 11 }}>{initials(b.camper.name)}</span>
                  <span style={{ flex: '1 1 180px' }}><b style={{ fontSize: 14 }}>{b.camper.name}</b><div className="mut">{b.site.name} · {b.guests} guests · {b.ref}</div></span>
                  <span className="mut">{arrivalText(b.from)}</span>
                  <BookingBadge status={b.status} />
                  <button className="btn s" onClick={() => navigate(`/owner/bookings/${b.id}`)}>Open</button>
                </div>
              ))}
              {d.arrivals.length === 0 && <p className="mut">No confirmed arrivals in the next two weeks.</p>}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 20 }}>
            <div className="sec"><h3>Campsite availability summary</h3><span className="sub">Next 7 nights</span>
              <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/owner/availability')}>Manage calendar</button></div>
            <div className="tw" style={{ boxShadow: 'none' }}>
              <table className="tbl">
                <thead><tr><th>Campsite</th><th>Max capacity</th><th>Booked</th><th>Remaining</th><th>Closed dates</th><th>Status</th></tr></thead>
                <tbody>
                  {d.sites.map((s) => {
                    const left = Math.max(0, s.cap * 7 - s.bookedWeek)
                    return (
                      <tr key={s.id}>
                        <td><b>{s.name}</b><div className="mut">{s.prov}</div></td>
                        <td>{s.cap} / night</td>
                        <td>{s.bookedWeek} guest-nights</td>
                        <td><b style={{ color: left === 0 ? '#A8231C' : '#17703F' }}>{left} guest-nights</b></td>
                        <td>{s.closedDates} dates</td>
                        <td><span className={LST[s.listing][0]}>{s.active ? LST[s.listing][1] : 'Inactive'}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 20 }}>
            <div className="sec"><h3>Campsite performance</h3><span className="sub">Confirmed bookings per month</span></div>
            <div className="bars">
              {d.chart.map(([label, n]) => (
                <div key={label} className="b"><span style={{ fontSize: 11, color: 'var(--muted)' }}>{n}</span><span className="bf" style={{ height: `${Math.round((n / 22) * 100)}%` }}></span><span className="bl">{label}</span></div>
              ))}
            </div>
            <div className="hr"></div>
            <div className="grid g3" style={{ gap: 14 }}>
              {d.sites.slice(0, 3).map((s) => {
                const pct = `${Math.min(100, Math.round((s.bookedWeek / Math.max(1, s.cap * 7)) * 100))}%`
                return (
                  <div key={s.id}>
                    <div className="mut">{s.name}</div>
                    <div className="row" style={{ gap: 8, marginTop: 4 }}><span className="star">★ {s.rating.toFixed(1)}</span><span className="mut">{s.nrev} reviews</span></div>
                    <div className="ratebar" style={{ marginTop: 6 }}><span className="tk"><i style={{ width: pct }}></i></span><span className="mut">{pct} occupancy</span></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <aside style={{ flex: '0 0 330px' }}>
          <div className="card pad24">
            <h3>Recent booking activity</h3>
            <div className="tl" style={{ marginTop: 14 }}>
              {d.activity.map((b) => (
                <div key={b.id} className={b.status === 'pending' ? 'it cu' : 'it dn'}>
                  <span className="dot"></span>
                  <div><div className="tx">{b.camper.name} · {b.ref} · {ST[b.status][1]}</div><div className="tm">{fmtDate(b.created)} · {b.site.name}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card pad24" style={{ marginTop: 20 }}>
            <h3>Verification</h3>
            <div className="col" style={{ gap: 10, marginTop: 12 }}>
              {d.sites.map((s) => (
                <div key={s.id} className="row" style={{ gap: 9 }}><span style={{ flex: '1 1 140px', fontSize: 13.5 }}>{s.name}</span><VerBadge ver={s.ver} /></div>
              ))}
            </div>
            <button className="btn w" style={{ marginTop: 14 }} onClick={() => navigate('/owner/verification')}>Manage documents</button>
          </div>
          <div className="card pad24" style={{ marginTop: 20 }}>
            <h3>Quick actions</h3>
            <div className="col" style={{ gap: 8, marginTop: 12 }}>
              <button className="btn w" onClick={() => navigate('/owner/campsites/new')}>Create a campsite</button>
              <button className="btn w" onClick={() => navigate('/owner/bookings')}>Booking management</button>
              <button className="btn w" onClick={() => navigate('/owner/check-in')}>Check-in / check-out</button>
              <button className="btn w" onClick={() => navigate('/owner/campsites')}>My campsites</button>
            </div>
            <div className="hr"></div>
            <p className="mut">Reminder: confirm each campsite is still active every three months to keep its approved badge.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

