import { useLoaderData, useNavigate } from 'react-router-dom'
import { getAdminDashboard } from '../../api/admin'
import { fmtDate } from '../../utils/format'

export async function loader() {
  return getAdminDashboard()
}

const STEP_CLS = { done: 'it dn', current: 'it cu', todo: 'it' }

export default function AdminDashboardPage() {
  const d = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Platform overview</h1><p className="mut" style={{ marginTop: 6 }}>{d.pendingVerifications} verification requests and {d.openReports} reports need attention today.</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <button className="btn s" onClick={() => navigate('/admin/verification')}>Verification queue</button>
          <button className="btn p s" onClick={() => navigate('/admin/reports')}>Open reports</button>
        </div>
      </div>
      <div className="grid g4">
        <div className="card stat"><span className="k">Total users</span><span className="v">{d.users}</span><span className="t">{d.campers} campers · {d.owners} owners</span></div>
        <div className="card stat"><span className="k">Campsites listed</span><span className="v">{d.sites}</span><span className="t">{d.approved} approved</span></div>
        <div className="card stat"><span className="k">Pending verifications</span><span className="v" style={{ color: 'var(--warn)' }}>{d.pendingVerifications}</span><span className="t">Documents to review</span></div>
        <div className="card stat"><span className="k">Open reports</span><span className="v" style={{ color: 'var(--err)' }}>{d.openReports}</span><span className="t">Complaints to action</span></div>
      </div>
      <div className="body" style={{ gap: 20, alignItems: 'flex-start', marginTop: 20 }}>
        <div className="main" style={{ flex: '999 1 560px' }}>
          <div className="card pad24">
            <div className="sec"><h3>Booking statistics</h3><span className="sub">Bookings created per month</span></div>
            <div className="bars">
              {d.chart.map(([label, n]) => (
                <div key={label} className="b"><span style={{ fontSize: 11, color: 'var(--muted)' }}>{n}</span><span className="bf" style={{ height: `${Math.round((n / 65) * 100)}%` }}></span><span className="bl">{label}</span></div>
              ))}
            </div>
            <div className="hr"></div>
            <div className="don">
              <div className="lgd" style={{ flex: '1 1 220px' }}>
                <strong style={{ fontSize: 13 }}>Bookings by status</strong>
                {d.bookingStatus.map((s) => <span key={s.label}><i style={{ background: s.color }}></i>{s.label} — <b>{s.n}</b> ({s.pct}%)</span>)}
              </div>
              <div style={{ flex: '1 1 240px' }}>
                {d.bookingStatus.map((s) => (
                  <div key={s.label} className="ratebar" style={{ marginBottom: 7 }}>
                    <span style={{ width: 84, fontSize: 12 }}>{s.label}</span><span className="tk"><i style={{ width: `${s.pct}%`, background: s.color }}></i></span><b style={{ fontSize: 12 }}>{s.n}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card pad24" style={{ marginTop: 20 }}>
            <div className="sec"><h3>Needs attention</h3></div>
            <div className="grid g2" style={{ gap: 14 }}>
              <div className="card pad" style={{ boxShadow: 'none', borderColor: '#EBD3B0', background: '#FDF6EA' }}>
                <div className="row"><b>Verification requests</b><span className="bg wa mla" style={{ marginLeft: 'auto' }}>{d.pendingVerifications} pending</span></div>
                <p className="mut" style={{ marginTop: 7 }}>{d.oldestVerification ? `Oldest request submitted ${fmtDate(d.oldestVerification.date)} · ${d.oldestVerification.site}` : 'The queue is empty.'}</p>
                <button className="btn p s" style={{ marginTop: 10 }} onClick={() => navigate('/admin/verification')}>Review documents</button>
              </div>
              <div className="card pad" style={{ boxShadow: 'none', borderColor: '#EBC4C1', background: '#FBECEB' }}>
                <div className="row"><b>Reports and complaints</b><span className="bg er mla" style={{ marginLeft: 'auto' }}>{d.openReports} open</span></div>
                <p className="mut" style={{ marginTop: 7 }}>{d.latestReport ? `Latest: ${d.latestReport.cat.toLowerCase()} at ${d.latestReport.site}` : 'No open reports.'}</p>
                <button className="btn p s" style={{ marginTop: 10 }} onClick={() => navigate('/admin/reports')}>Review reports</button>
              </div>
              <div className="card pad" style={{ boxShadow: 'none' }}>
                <div className="row"><b>Reported reviews</b><span className="bg in mla" style={{ marginLeft: 'auto' }}>{d.flaggedReviews} flagged</span></div>
                <p className="mut" style={{ marginTop: 7 }}>Moderate reviews that campers or owners flagged.</p>
                <button className="btn s" style={{ marginTop: 10 }} onClick={() => navigate('/admin/reviews')}>Open moderation</button>
              </div>
              <div className="card pad" style={{ boxShadow: 'none' }}>
                <div className="row"><b>Announcements</b><span className="bg mu mla" style={{ marginLeft: 'auto' }}>{d.draftAnnouncements} drafts</span></div>
                <p className="mut" style={{ marginTop: 7 }}>Publish platform notices for campers and owners.</p>
                <button className="btn s" style={{ marginTop: 10 }} onClick={() => navigate('/admin/announcements')}>Manage announcements</button>
              </div>
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 330px' }}>
          <div className="card pad24">
            <h3>Recent platform activity</h3>
            <div className="tl" style={{ marginTop: 14 }}>
              {d.activity.map((a) => (
                <div key={a.text} className={STEP_CLS[a.state]}><span className="dot"></span><div><div className="tx">{a.text}</div><div className="tm">{fmtDate(a.when)}</div></div></div>
              ))}
            </div>
          </div>
          <div className="card pad24" style={{ marginTop: 20 }}>
            <h3>Management modules</h3>
            <div className="col" style={{ gap: 8, marginTop: 12 }}>
              <button className="btn w" onClick={() => navigate('/admin/users')}>User management</button>
              <button className="btn w" onClick={() => navigate('/admin/campsites')}>Campsite management</button>
              <button className="btn w" onClick={() => navigate('/admin/verification')}>Verification management</button>
              <button className="btn w" onClick={() => navigate('/admin/reports')}>Reports &amp; complaints</button>
              <button className="btn w" onClick={() => navigate('/admin/reviews')}>Review moderation</button>
              <button className="btn w" onClick={() => navigate('/admin/announcements')}>Announcements</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
