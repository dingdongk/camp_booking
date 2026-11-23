import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { listMyReviews } from '../../api/community'
import { ReviewDialog } from '../../components/booking/ReviewDialog'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate } from '../../utils/format'

export async function loader() {
  return listMyReviews()
}

export default function MyReviewsPage() {
  const { reviews, awaiting } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { confirm } = useFeedback()
  const [reviewing, setReviewing] = useState<{ site: string; dates: string } | null>(null)

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>My reviews</h1>
          <p className="mut" style={{ marginTop: 6 }}>{reviews.length} published · {awaiting.length} completed stay{awaiting.length === 1 ? '' : 's'} waiting for a review</p></div>
      </div>
      {awaiting.length > 0 && (
        <div className="card pad24" style={{ marginBottom: 20, background: '#FDF6EA', borderColor: '#EBD3B0' }}>
          <div className="sec"><h3>Waiting for your review</h3><span className="sub">Completed stays you have not reviewed yet</span></div>
          <div className="col" style={{ gap: 10 }}>
            {awaiting.map((b) => {
              const dates = `${fmtDate(b.from)} → ${fmtDate(b.to)}`
              return (
                <div key={b.id} className="row" style={{ gap: 12 }}>
                  <b>{b.site.name}</b><span className="mut">{dates}</span>
                  <button className="btn p s mla" style={{ marginLeft: 'auto' }} onClick={() => setReviewing({ site: b.site.name, dates })}>Write review</button>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {reviews.length > 0 ? (
        <div className="col" style={{ gap: 14 }}>
          {reviews.map((r) => (
            <div key={r.id} className="card pad24">
              <div className="sec" style={{ marginBottom: 8 }}>
                <div><h4>{r.siteName}</h4><div className="mut" style={{ marginTop: 3 }}>{r.siteAddr} · reviewed {fmtDate(r.date)}</div></div>
                <div className="row mla" style={{ marginLeft: 'auto' }}>
                  <span className="bg ok">Verified booking {r.bookingRef}</span>
                  <span className={r.status === 'hidden' ? 'bg er' : r.flagged ? 'bg wa' : 'bg ok'}>
                    {r.status === 'hidden' ? 'Hidden by moderation' : r.flagged ? 'Reported — under review' : 'Published'}
                  </span>
                </div>
              </div>
              <div className="row" style={{ gap: 18 }}>
                <span className="star">★ {r.rating.toFixed(1)} overall</span>
                <span className="mut">Cleanliness <b>{r.clean}</b></span>
                <span className="mut">Infrastructure <b>{r.infra}</b></span>
              </div>
              <p style={{ marginTop: 10 }}>{r.text}</p>
              <div className="row" style={{ marginTop: 14, gap: 9 }}>
                <button className="btn s" onClick={() => setReviewing({ site: r.siteName, dates: fmtDate(r.date) })}>Edit review</button>
                <button className="btn d s" onClick={() => confirm({ title: 'Delete this review?', body: `Your review of ${r.siteName} is removed and the campsite rating is recalculated.`, ok: 'Delete review', danger: true })}>Delete</button>
                <button className="btn g s" onClick={() => navigate(`/campsites/${r.siteId}`)}>View campsite</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty"><span className="ic">☆</span><h3>No reviews yet</h3><p className="mut" style={{ maxWidth: 420 }}>Reviews unlock when a stay is completed — after you confirm check-out.</p><button className="btn p" onClick={() => navigate('/me/bookings')}>See my bookings</button></div>
      )}
      {reviewing && <ReviewDialog site={reviewing.site} dates={reviewing.dates} onClose={() => setReviewing(null)} />}
    </div>
  )
}
