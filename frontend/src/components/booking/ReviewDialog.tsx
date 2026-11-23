import { useState } from 'react'
import { useFeedback } from '../ui/Feedback'

function Stars({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} className={value >= n ? 'on' : ''} onClick={() => onChange(n)} aria-label={label}>★</button>
      ))}
    </div>
  )
}

/** Review composer shared by My bookings, Booking details and My reviews. */
export function ReviewDialog({ site, dates, onClose }: { site: string; dates: string; onClose: () => void }) {
  const { notConnected } = useFeedback()
  const [rv, setRv] = useState({ rating: 0, clean: 0, infra: 0, text: '' })
  return (
    <div className="ovl">
      <div className="mod wide">
        <div className="sec"><h3>Review your stay</h3><button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={onClose}>Close</button></div>
        <p className="mut">{site} · {dates} · one verified review per completed booking</p>
        <div className="col" style={{ gap: 16, marginTop: 16 }}>
          <div className="row" style={{ gap: 28 }}>
            <div className="fld"><span className="lbl">Overall rating *</span><Stars value={rv.rating} onChange={(n) => setRv({ ...rv, rating: n })} label="Rate" /></div>
            <div className="fld"><span className="lbl">Cleanliness *</span><Stars value={rv.clean} onChange={(n) => setRv({ ...rv, clean: n })} label="Rate cleanliness" /></div>
            <div className="fld"><span className="lbl">Infrastructure *</span><Stars value={rv.infra} onChange={(n) => setRv({ ...rv, infra: n })} label="Rate infrastructure" /></div>
          </div>
          <div className="fld"><span className="lbl">Your review *</span>
            <textarea className="inp" placeholder="What was the campsite like? Facilities, cleanliness, the owner, the surroundings." value={rv.text} onChange={(e) => setRv({ ...rv, text: e.target.value })}></textarea>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn p" onClick={notConnected}>Publish review</button>
          </div>
        </div>
      </div>
    </div>
  )
}
