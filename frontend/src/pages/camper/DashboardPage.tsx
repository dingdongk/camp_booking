import { useLoaderData, useNavigate } from 'react-router-dom'
import { getCamperDashboard } from '../../api/bookings'
import { BookingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate, vnd } from '../../utils/format'

export async function loader() {
  return getCamperDashboard()
}

export default function DashboardPage() {
  const d = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const next = d.upcoming[0]
  const greeting = d.upcoming.length
    ? `You have ${d.upcoming.length} upcoming stay${d.upcoming.length > 1 ? 's' : ''}, the next one at ${next.site.name}.`
    : 'No upcoming stays yet — the dry season in Da Lat starts next month.'

  return (
    <div className="wrap">
      <div className="card pad24" style={{ background: 'var(--forest)', borderColor: 'var(--forest)', color: '#EAF3EE', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
        <div style={{ flex: '1 1 380px' }}>
          <h1 style={{ color: '#fff' }}>Chao Minh Anh — where to next?</h1>
          <p style={{ marginTop: 8, color: '#C9DDD3' }}>{greeting}</p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn a" onClick={() => navigate('/search')}>Find a campsite</button>
          <button className="btn" onClick={() => navigate('/chat')}>Ask the AI assistant</button>
        </div>
      </div>

      <div className="grid g4" style={{ marginTop: 20 }}>
        <div className="card stat"><span className="k">Upcoming stays</span><span className="v">{d.upcoming.length}</span><span className="t">Confirmed and ready</span></div>
        <div className="card stat"><span className="k">Awaiting approval</span><span className="v">{d.pending}</span><span className="t">Owner has not replied yet</span></div>
        <div className="card stat"><span className="k">Completed stays</span><span className="v">{d.completed}</span><span className="t">{d.reviewable} can be reviewed</span></div>
        <div className="card stat"><span className="k">Saved campsites</span><span className="v">{d.favorites.length}</span><span className="t">In your favorites</span></div>
      </div>

      <div className="body" style={{ gap: 20, alignItems: 'flex-start', marginTop: 20 }}>
        <div className="main" style={{ flex: '999 1 560px' }}>
          <div className="card pad24">
            <div className="sec"><h3>Upcoming bookings</h3><button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/me/bookings')}>All bookings</button></div>
            <div className="col" style={{ gap: 12 }}>
              {d.upcoming.slice(0, 3).map((b) => (
                <div key={b.id} className="card" style={{ boxShadow: 'none', display: 'flex', flexWrap: 'wrap', gap: 14, padding: 12, alignItems: 'center' }}>
                  <span className="ph" style={{ background: b.site.hue, width: 96, height: 72, borderRadius: 10, flex: '0 0 96px' }}></span>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div className="row" style={{ gap: 8 }}><b>{b.site.name}</b><BookingBadge status={b.status} /></div>
                    <div className="mut" style={{ marginTop: 3 }}>{fmtDate(b.from)} → {fmtDate(b.to)} · {b.guests} guests · {b.ref}</div>
                    <div className="mut">{b.actions.arrive ? 'Arriving today — confirm your arrival' : `Owner confirmed · ${b.site.owner}`}</div>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn s" onClick={() => navigate(`/me/bookings/${b.id}`)}>Details</button>
                    {b.actions.arrive && <button className="btn p s" onClick={notConnected}>Confirm arrival</button>}
                  </div>
                </div>
              ))}
              {d.upcoming.length === 0 && (
                <div className="empty"><span className="ic">⛺</span><h4>No upcoming stays</h4><p className="mut">Find a campsite and send your first booking request.</p><button className="btn p" onClick={() => navigate('/search')}>Browse campsites</button></div>
              )}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 20 }}>
            <div className="sec"><h3>Favorite campsites</h3><button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/me/favorites')}>Manage favorites</button></div>
            <div className="grid g3" style={{ gap: 14 }}>
              {d.favorites.slice(0, 3).map((c) => (
                <button key={c.id} className="sc" style={{ cursor: 'pointer' }} onClick={() => navigate(`/campsites/${c.id}`)}>
                  <div className="ph" style={{ background: c.hue, height: 96 }}><span className="pl">{c.prov}</span></div>
                  <div className="bd" style={{ padding: '11px 12px' }}><b style={{ fontSize: 14 }}>{c.name}</b><span className="mut">{vnd(c.price)} / night</span></div>
                </button>
              ))}
              {d.favorites.length === 0 && <p className="mut">No favorites saved yet. Tap the heart on any campsite card.</p>}
            </div>
          </div>
        </div>

        <aside style={{ flex: '0 0 340px' }}>
          <div className="card pad24">
            <h3>Booking statistics</h3>
            <div className="bars" style={{ marginTop: 14 }}>
              {d.chart.map(([label, n]) => (
                <div key={label} className="b"><span style={{ fontSize: 11, color: 'var(--muted)' }}>{n}</span><span className="bf" style={{ height: `${Math.round((n / 5) * 100)}%` }}></span><span className="bl">{label}</span></div>
              ))}
            </div>
            <p className="mut" style={{ marginTop: 10 }}>Nights camped per month, last 6 months.</p>
            <div className="hr"></div>
            <div className="kv">
              <span className="k">Total bookings</span><span>{d.total}</span>
              <span className="k">Nights camped</span><span>{d.nights}</span>
              <span className="k">Reviews written</span><span>{d.reviews}</span>
              <span className="k">Reports filed</span><span>{d.reports}</span>
            </div>
          </div>
          <div className="card pad24" style={{ marginTop: 20 }}>
            <h3>Recent activity</h3>
            <div className="tl" style={{ marginTop: 14 }}>
              {d.activity.map((a) => (
                <div key={a.text} className={a.done ? 'it dn' : 'it'}><span className="dot"></span><div><div className="tx">{a.text}</div><div className="tm">{fmtDate(a.when)}</div></div></div>
              ))}
            </div>
          </div>
          <div className="card pad24" style={{ marginTop: 20 }}>
            <h3>Quick links</h3>
            <div className="col" style={{ gap: 8, marginTop: 12 }}>
              <button className="btn w" onClick={() => navigate('/me/bookings')}>My bookings</button>
              <button className="btn w" onClick={() => navigate('/me/reviews')}>My reviews</button>
              <button className="btn w" onClick={() => navigate('/me/reports')}>My reports</button>
              <button className="btn w" onClick={() => navigate('/me/profile')}>Profile &amp; settings</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
