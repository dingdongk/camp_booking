import { useLoaderData, useNavigate } from 'react-router-dom'
import { listMyReports } from '../../api/community'
import { useFeedback } from '../../components/ui/Feedback'
import type { Report } from '../../types/models'
import { fmtDate } from '../../utils/format'

export async function loader() {
  return { reports: await listMyReports() }
}

const STATUS: Record<Report['status'], [string, string]> = {
  pending: ['bg wa', 'Pending review'], info: ['bg in', 'More information needed'], resolved: ['bg ok', 'Resolved'], rejected: ['bg er', 'Rejected'],
}

export default function MyReportsPage() {
  const { reports } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { confirm } = useFeedback()
  const open = reports.filter((r) => r.status === 'pending').length

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>My reports</h1><p className="mut" style={{ marginTop: 6 }}>{reports.length} report{reports.length === 1 ? '' : 's'} submitted · {open} still open</p></div>
        <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/search')}>Report another listing</button>
      </div>
      {reports.length > 0 ? (
        <div className="col" style={{ gap: 14 }}>
          {reports.map((r) => (
            <div key={r.id} className="card pad24">
              <div className="sec" style={{ marginBottom: 8 }}>
                <div className="row" style={{ gap: 9 }}><span className="bg in">{r.cat}</span><b>{r.siteName}</b></div>
                <div className="row mla" style={{ marginLeft: 'auto' }}><span className={STATUS[r.status][0]}>{STATUS[r.status][1]}</span><span className="mut">{fmtDate(r.date)}</span></div>
              </div>
              <p>{r.text}</p>
              <div className="row" style={{ gap: 9, marginTop: 10 }}><span className="pill">Evidence: {r.file}</span><span className="pill">Reference {r.ref}</span></div>
              {r.reply && <div className="okmsg" style={{ marginTop: 12 }}><b>Administrator:</b> {r.reply}</div>}
              <div className="row" style={{ marginTop: 12, gap: 9 }}>
                <button className="btn s" onClick={() => navigate(`/campsites/${r.siteId}`)}>View campsite</button>
                {r.status === 'pending' && (
                  <button className="btn d s" onClick={() => confirm({ title: `Withdraw report ${r.ref}?`, body: 'The administrators will stop reviewing it.', ok: 'Withdraw', danger: true })}>Withdraw report</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty"><span className="ic">⚠</span><h3>You have not reported anything</h3><p className="mut" style={{ maxWidth: 430 }}>If a campsite is inactive, overcrowded or its information is wrong, report it from the campsite page.</p><button className="btn p" onClick={() => navigate('/search')}>Browse campsites</button></div>
      )}
    </div>
  )
}
