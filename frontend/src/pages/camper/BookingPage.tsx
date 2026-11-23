import { useState } from 'react'
import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom'
import { getBookingDraft } from '../../api/bookings'
import { VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate, nightsBetween, vnd } from '../../utils/format'

export async function loader({ params }: LoaderFunctionArgs) {
  return getBookingDraft(params.id!)
}

export default function BookingPage() {
  const { site: s, search, contact } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const [f, setF] = useState(search)
  const [bk, setBk] = useState({ ...contact, arrival: '14:00 - 17:00', gear: 'I bring my own tent', note: '', rules: false })

  const n = nightsBetween(f.from, f.to)
  const ok = n >= 1 && s.placesLeft >= f.guests
  const availMsg = n < 1 ? 'Choose a check-out date after the check-in date.'
    : s.placesLeft <= 0 ? 'No places left for those nights. Pick other dates or a smaller group.'
    : s.placesLeft < f.guests ? `Only ${s.placesLeft} places are free for those nights — you asked for ${f.guests}.`
    : `${s.placesLeft} of ${s.cap} places free for all ${n} nights. You can request this stay.`
  const total = n * s.price
  const setB = (k: 'name' | 'phone' | 'email' | 'arrival' | 'gear' | 'note') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setBk({ ...bk, [k]: e.target.value })

  return (
    <div className="wrap" style={{ maxWidth: 1080 }}>
      <button className="bk" onClick={() => navigate(`/campsites/${s.id}`)}>← Back to campsite</button>
      <h1 style={{ fontSize: 27, margin: '8px 0 6px' }}>Request a booking</h1>
      <p className="mut">Step 2 of 3 · the owner reviews your request and accepts or rejects it. No payment is taken on VietCamp.</p>
      <div className="body" style={{ gap: 24, alignItems: 'flex-start', marginTop: 20 }}>
        <div className="main" style={{ flex: '999 1 480px' }}>
          <div className="card pad24">
            <h3>Your stay</h3>
            <div className="row" style={{ gap: 14, marginTop: 14 }}>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Check-in *</span><input className="inp" type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></div>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Check-out *</span><input className="inp" type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
              <div className="fld" style={{ flex: '0 1 140px' }}><span className="lbl">Guests *</span><input className="inp" type="number" min="1" max="60" value={f.guests} onChange={(e) => setF({ ...f, guests: Number(e.target.value) })} /></div>
            </div>
            <div className={ok ? 'okmsg' : 'ermsg'} style={{ marginTop: 14 }}>{availMsg}</div>
          </div>
          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Booking information</h3>
            <div className="col" style={{ gap: 14, marginTop: 14 }}>
              <div className="row" style={{ gap: 14 }}>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Lead camper name *</span><input className="inp" type="text" value={bk.name} onChange={setB('name')} /></div>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Phone number *</span><input className="inp" type="tel" value={bk.phone} onChange={setB('phone')} /></div>
              </div>
              <div className="fld"><span className="lbl">Email *</span><input className="inp" type="email" value={bk.email} onChange={setB('email')} /></div>
              <div className="row" style={{ gap: 14 }}>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Estimated arrival time</span>
                  <select className="inp" value={bk.arrival} onChange={setB('arrival')}>
                    <option value="Before 14:00">Before 14:00</option><option value="14:00 - 17:00">14:00 - 17:00</option>
                    <option value="17:00 - 20:00">17:00 - 20:00</option><option value="After 20:00">After 20:00</option>
                  </select>
                </div>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Equipment</span>
                  <select className="inp" value={bk.gear} onChange={setB('gear')}>
                    <option value="I bring my own tent">I bring my own tent</option><option value="I need to rent a tent">I need to rent a tent</option><option value="Campervan / car">Campervan / car</option>
                  </select>
                </div>
              </div>
              <div className="fld"><span className="lbl">Special requests for the owner</span>
                <textarea className="inp" placeholder="Anything the owner should know: children, pets, late arrival, a pitch near the washrooms..." value={bk.note} onChange={setB('note')}></textarea>
                <span className="mut">The owner sees this with your request and can take it into account before accepting.</span>
              </div>
              <label className="chk"><input type="checkbox" checked={bk.rules} onChange={(e) => setBk({ ...bk, rules: e.target.checked })} /><span>I have read the campsite rules and the 24-hour cancellation policy *</span></label>
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 330px' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="ph" style={{ background: s.hue, height: 120 }}><span className="pl">{s.prov}</span><div className="tl"><VerBadge ver={s.ver} /></div></div>
            <div className="pad24">
              <h4>{s.name}</h4>
              <p className="mut" style={{ marginTop: 4 }}>{s.addr}</p>
              <div className="star" style={{ marginTop: 6 }}>★ {s.rating.toFixed(1)} <span className="mut">({s.nrev} reviews)</span></div>
              <div className="hr"></div>
              <div className="kv">
                <span className="k">Check-in</span><span>{fmtDate(f.from)}</span>
                <span className="k">Check-out</span><span>{fmtDate(f.to)}</span>
                <span className="k">Nights</span><span>{n}</span>
                <span className="k">Guests</span><span>{f.guests} guests</span>
              </div>
              <div className="hr"></div>
              <div className="kv">
                <span className="k">{vnd(s.price)} × {n} nights</span><span>{vnd(total)}</span>
                <span className="k">Service fee</span><span>None — paid on site</span>
              </div>
              <div className="row" style={{ marginTop: 12, alignItems: 'baseline' }}><b>Estimated total</b><b className="mla" style={{ marginLeft: 'auto', fontSize: 19, color: 'var(--forest)' }}>{vnd(total)}</b></div>
              <p className="mut" style={{ marginTop: 6 }}>Settled directly with the owner at the campsite.</p>
              <button className="btn p w" style={{ marginTop: 14 }} onClick={notConnected} disabled={!ok}>Submit booking request</button>
              <p className="mut" style={{ marginTop: 9, textAlign: 'center' }}>You can cancel free of charge up to 24 hours before arrival.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
