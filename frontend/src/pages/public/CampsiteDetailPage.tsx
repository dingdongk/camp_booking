import { useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams, type LoaderFunctionArgs } from 'react-router-dom'
import { DEFAULT_SEARCH, getCampsiteDetail } from '../../api/campsites'
import { getFavoriteIds } from '../../api/community'
import { CampsiteCard, FavButton } from '../../components/campsite/CampsiteCard'
import { SiteMap } from '../../components/map/CampsiteMap'
import { VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { WEEKDAYS, currentMonth, fmtDate, initials, leadingBlanks, monthTitle, nightsBetween, shiftMonth, vnd } from '../../utils/format'
import { VER } from '../../utils/labels'

const STAY_HUES = ['#2F5D3A', '#6B5A38', '#24596B']

export async function loader({ params, request }: LoaderFunctionArgs) {
  const month = new URL(request.url).searchParams.get('month') ?? currentMonth()
  const [detail, favorites] = await Promise.all([getCampsiteDetail(params.id!, month), getFavoriteIds()])
  return { ...detail, month, favorites }
}

export default function CampsiteDetailPage() {
  const { site: s, owner, reviews, similar, calendar, month, favorites } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()
  const { notConnected } = useFeedback()
  const [dates, setDates] = useState(DEFAULT_SEARCH)
  const [report, setReport] = useState({ open: false, cat: '', text: '' })

  const lead = leadingBlanks(month)
  const n = nightsBetween(dates.from, dates.to)
  const left = s.placesLeft
  const ok = n >= 1 && left >= dates.guests
  const availMsg = n < 1 ? 'Choose a check-out date after the check-in date.'
    : left <= 0 ? 'No places left for those nights. Pick other dates or a smaller group.'
    : left < dates.guests ? `Only ${left} places are free for those nights — you asked for ${dates.guests}.`
    : `${left} of ${s.cap} places free for all ${n} nights. You can request this stay.`
  const coord = `${s.lat.toFixed(4)}° N, ${s.lng.toFixed(4)}° E`
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`
  const gdir = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`
  const book = () => navigate(`/campsites/${s.id}/book`)

  return (
    <div className="wrap">
      <div className="crumb">
        <button onClick={() => navigate('/')}>Home</button><span className="sep">/</span>
        <button onClick={() => navigate('/search')}>Campsites</button><span className="sep">/</span>
        <button onClick={() => navigate('/search')}>{s.prov}</button><span className="sep">/</span>
        <b>{s.name}</b>
      </div>
      <button className="bk" onClick={() => navigate(-1)}>← Back to results</button>
      <div className="sec" style={{ margin: '8px 0 14px' }}>
        <div>
          <div className="row" style={{ gap: 9 }}>
            <VerBadge ver={s.ver} />
            <span className="bg mu">{s.cat}</span>
            <span className="bg in">Up to {s.cap} guests</span>
          </div>
          <h1 style={{ marginTop: 10 }}>{s.name}</h1>
          <div className="row" style={{ gap: 16, marginTop: 8 }}>
            <span className="star">★ {s.rating.toFixed(1)} <span className="mut">({s.nrev} reviews)</span></span>
            <span className="mut">{s.addr}, {s.prov}</span>
          </div>
        </div>
        <div className="row mla" style={{ marginLeft: 'auto', gap: 9 }}>
          <FavButton initial={favorites.includes(s.id)} />
          <a className="btn s" href={gmaps} target="_blank" rel="noopener">View on Google Maps</a>
          <button className="btn p s" onClick={book}>Request to book</button>
        </div>
      </div>
      <div className="gal" style={{ margin: '10px 0 22px' }}>
        <div className="a"><div className="ph" style={{ background: s.hue }}><span className="pl">{s.name} — main view</span></div></div>
        <div className="ph" style={{ background: '#3E6B4F' }}><span className="pl">Tent area</span></div>
        <div className="ph" style={{ background: '#6B5A38' }}><span className="pl">Facilities</span></div>
        <div className="ph" style={{ background: '#2B4A5E' }}><span className="pl">Surroundings</span></div>
        <div className="ph" style={{ background: '#4A3E2E' }}><span className="pl">Evening</span></div>
      </div>

      <div className="body" style={{ gap: 28, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 560px' }}>
          <div className="card pad24">
            <h3>About this campsite</h3>
            <p className="lead" style={{ marginTop: 10, whiteSpace: 'pre-line' }}>{s.desc}</p>
            <div className="hr"></div>
            <div className="grid g4" style={{ gap: 14 }}>
              <div><div className="mut">Maximum capacity</div><b>{s.cap} guests</b></div>
              <div><div className="mut">Area</div><b>{s.area}</b></div>
              <div><div className="mut">Check-in / out</div><b>14:00 / 12:00</b></div>
              <div><div className="mut">Listed since</div><b>{s.since}</b></div>
            </div>
          </div>

          <div className="grid g2" style={{ marginTop: 18 }}>
            <div className="card pad24">
              <h3>Facilities</h3>
              <div className="row" style={{ gap: 7, marginTop: 12 }}>{s.fac.map((x) => <span key={x} className="pill">{x}</span>)}</div>
              <div className="hr"></div>
              <h4>Services</h4>
              <div className="row" style={{ gap: 7, marginTop: 10 }}>{s.srv.map((x) => <span key={x} className="pill">{x}</span>)}</div>
            </div>
            <div className="card pad24">
              <h3>Accessibility</h3>
              <div className="col" style={{ gap: 9, marginTop: 12 }}>
                {s.acc.map((x) => <div key={x} className="row" style={{ gap: 9 }}><span className="bg ok">✓</span><span>{x}</span></div>)}
              </div>
              <div className="hr"></div>
              <p className="mut">Accessibility details are provided by the campsite owner and re-confirmed every three months.</p>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <div className="sec"><h3>Camping options</h3><span className="sub">What you can book on this pitch</span></div>
            <div className="col" style={{ gap: 10 }}>
              {s.stay.map(([name, note, price], i) => (
                <div key={name} className="card" style={{ boxShadow: 'none', display: 'flex', flexWrap: 'wrap', gap: 12, padding: 13, alignItems: 'center' }}>
                  <span className="ph" style={{ background: STAY_HUES[i % 3], width: 74, height: 56, borderRadius: 9, flex: '0 0 74px' }}></span>
                  <span style={{ flex: '1 1 220px' }}><b>{name}</b><div className="mut" style={{ marginTop: 3 }}>{note}</div></span>
                  <span style={{ textAlign: 'right' }}><b style={{ color: 'var(--forest)' }}>{vnd(price)}</b><div className="mut">per night</div></span>
                </div>
              ))}
              {s.stay.length === 0 && <p className="mut">The owner has not listed separate camping options; the price covers one pitch per night.</p>}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <div className="sec"><h3>Availability</h3><span className="sub">{monthTitle(month)}</span>
              <div className="row mla" style={{ marginLeft: 'auto', gap: 6 }}>
                <button className="btn s" onClick={() => setParams({ month: shiftMonth(month, -1) }, { preventScrollReset: true })}>←</button>
                <button className="btn s" onClick={() => setParams({ month: shiftMonth(month, 1) }, { preventScrollReset: true })}>→</button>
              </div>
            </div>
            <div className="cal">
              {WEEKDAYS.map((w) => <div key={w} className="hd">{w}</div>)}
              {Array.from({ length: lead }, (_, i) => <button key={`pad${i}`} className="cel pad" disabled></button>)}
              {calendar.map((c) => (
                <button
                  key={c.date}
                  className={`cel ${c.kind}${c.date === dates.from ? ' sel' : ''}`}
                  disabled={c.past || c.closed}
                  onClick={() => setDates({ ...dates, from: c.date })}
                >
                  <span className="dd">{c.day}</span>
                  <span className="mut" style={{ fontSize: 11 }}>{c.closed ? 'Closed' : c.past ? '' : `${c.left} free`}</span>
                </button>
              ))}
            </div>
            <div className="leg">
              <span><i style={{ background: '#F2F9F5', borderColor: '#C9E3D5' }}></i>Available</span>
              <span><i style={{ background: '#FDF6EA', borderColor: '#EBD3B0' }}></i>Limited capacity</span>
              <span><i style={{ background: '#FBECEB', borderColor: '#EBC4C1' }}></i>Full</span>
              <span><i style={{ background: '#EFEADC', borderStyle: 'dashed' }}></i>Closed by owner / past</span>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <div className="sec"><h3>Location</h3><span className="sub">{coord}</span>
              <div className="row mla" style={{ marginLeft: 'auto', gap: 8 }}>
                <a className="btn s" href={gmaps} target="_blank" rel="noopener">View on Google Maps</a>
                <a className="btn p s" href={gdir} target="_blank" rel="noopener">Get directions</a>
              </div>
            </div>
            <div className="kv" style={{ marginBottom: 14 }}>
              <span className="k">Address</span><span>{s.addr}</span>
              <span className="k">District / ward</span><span>{s.district}</span>
              <span className="k">Province / city</span><span>{s.prov}</span>
              <span className="k">Coordinates</span><span>{coord}</span>
            </div>
            <SiteMap lat={s.lat} lng={s.lng} zoom={s.zoom} name={s.name} addr={s.addr} />
            <p className="mut" style={{ marginTop: 10 }}>Leaflet + OpenStreetMap tiles. Drag to pan, scroll or use the controls to zoom. Discovery only — no route planning inside the platform.</p>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <div className="sec"><h3>Nearby attractions</h3><span className="sub">Distances from the campsite gate</span></div>
            <div className="grid g2" style={{ gap: 10 }}>
              {s.near.map((x) => <div key={x} className="row" style={{ gap: 10 }}><span className="bg mu">⚲</span><span>{x}</span></div>)}
              {s.near.length === 0 && <p className="mut">The owner has not listed nearby landmarks yet.</p>}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <div className="sec"><h3>Reviews</h3><span className="sub">{s.nrev} reviews from completed stays</span></div>
            <div className="grid g3" style={{ gap: 14 }}>
              <div><div className="mut">Overall</div><div className="star" style={{ fontSize: 22 }}>★ {s.rating.toFixed(1)}</div></div>
              <div className="col" style={{ gap: 8 }}>
                <div className="ratebar"><span style={{ width: 92 }}>Cleanliness</span><span className="tk"><i style={{ width: `${Math.round((s.clean / 5) * 100)}%` }}></i></span><b>{s.clean.toFixed(1)}</b></div>
                <div className="ratebar"><span style={{ width: 92 }}>Infrastructure</span><span className="tk"><i style={{ width: `${Math.round((s.infra / 5) * 100)}%` }}></i></span><b>{s.infra.toFixed(1)}</b></div>
              </div>
              <div className="mut">Only campers whose stay was completed through VietCamp can review, one review per booking.</div>
            </div>
            <div className="hr"></div>
            <div className="col" style={{ gap: 14 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ display: 'flex', gap: 12 }}>
                  <span className="av" style={{ flex: '0 0 34px' }}>{initials(r.author)}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="row" style={{ gap: 9 }}><b>{r.author}</b><span className="bg ok">Verified stay</span><span className="mut mla" style={{ marginLeft: 'auto' }}>{fmtDate(r.date)}</span></div>
                    <div className="star" style={{ marginTop: 3 }}>★ {r.rating.toFixed(1)} <span className="mut">Cleanliness {r.clean} · Infrastructure {r.infra}</span></div>
                    <p style={{ marginTop: 6 }}>{r.text}</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="empty"><span className="ic">☆</span><h4>No reviews yet</h4><p className="mut">This campsite has not had a completed stay booked through VietCamp.</p></div>
              )}
            </div>
          </div>
        </div>

        <aside style={{ flex: '0 0 340px' }}>
          <div className="card pad24">
            <div className="row" style={{ alignItems: 'baseline', gap: 7 }}>
              <span style={{ fontSize: 27, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: 'var(--forest)' }}>{vnd(s.price)}</span><span className="mut">/ night</span>
            </div>
            <p className="mut" style={{ marginTop: 4 }}>Per night for the whole pitch, settled with the owner on site.</p>
            <div className="hr"></div>
            <div className="col" style={{ gap: 12 }}>
              <div className="row" style={{ gap: 10 }}>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Check-in</span><input className="inp" type="date" value={dates.from} onChange={(e) => setDates({ ...dates, from: e.target.value })} /></div>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Check-out</span><input className="inp" type="date" value={dates.to} onChange={(e) => setDates({ ...dates, to: e.target.value })} /></div>
              </div>
              <div className="fld"><span className="lbl">Guests</span><input className="inp" type="number" min="1" max="60" value={dates.guests} onChange={(e) => setDates({ ...dates, guests: Number(e.target.value) })} /></div>
              <div className={ok ? 'okmsg' : 'ermsg'}>{availMsg}</div>
              <button className="btn p w" onClick={book} disabled={!ok}>Request to book</button>
              <p className="mut" style={{ textAlign: 'center' }}>No payment online. The owner accepts or rejects your request.</p>
            </div>
            <div className="hr"></div>
            <div className="kv">
              <span className="k">Price basis</span><span>Per night, per pitch</span>
              <span className="k">Cancellation</span><span>Free up to 24h before arrival</span>
              <span className="k">Capacity left</span><span>{left} of {s.cap} guests</span>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Campsite owner</h3>
            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <span className="av" style={{ width: 46, height: 46, fontSize: 15 }}>{initials(owner.name)}</span>
              <div><b>{s.owner}</b><div className="mut">Owner since {owner.joined}</div></div>
            </div>
            <div className="kv" style={{ marginTop: 14 }}>
              <span className="k">Campsites listed</span><span>{owner.siteCount}</span>
              <span className="k">Response</span><span>Usually within 6 hours</span>
              <span className="k">Verification</span><span>{VER[s.ver][1]}</span>
            </div>
            <div className="hr"></div>
            <button className="btn w" onClick={() => setReport({ open: true, cat: '', text: '' })}>Report this listing</button>
            <p className="mut" style={{ marginTop: 9 }}>Inactive campsite, overcrowding or inaccurate information? Tell an administrator.</p>
          </div>
        </aside>
      </div>

      <div className="sec" style={{ marginTop: 36 }}><h2>Similar campsites</h2>
        <span className="sub">{similar.length ? `Other ${s.cat.toLowerCase()} campsites and nearby options` : 'No similar campsites listed yet'}</span>
        <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/search')}>See all campsites</button></div>
      <div className="grid g4">
        {similar.map((c) => <CampsiteCard key={c.id} site={c} variant="compact" photoHeight={132} fav={favorites.includes(c.id)} />)}
      </div>

      {report.open && (
        <div className="ovl">
          <div className="mod">
            <div className="sec"><h3>Report this listing</h3><button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={() => setReport({ ...report, open: false })}>Close</button></div>
            <p className="mut">{s.name}</p>
            <div className="col" style={{ gap: 14, marginTop: 16 }}>
              <div className="fld"><span className="lbl">Report category *</span>
                <select className="inp" value={report.cat} onChange={(e) => setReport({ ...report, cat: e.target.value })}>
                  <option value="">Select a category</option>
                  <option value="Inactive campsite">Inactive campsite</option>
                  <option value="Overcrowding">Overcrowding</option>
                  <option value="Inaccurate information">Inaccurate information</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="fld"><span className="lbl">What happened? *</span>
                <textarea className="inp" placeholder="Describe what you found, with dates if possible." value={report.text} onChange={(e) => setReport({ ...report, text: e.target.value })}></textarea>
              </div>
              <div className="fld"><span className="lbl">Evidence (optional)</span>
                <div className="up"><b>Attach a photo or document</b><span className="mut">PNG, JPG or PDF up to 10 MB</span><button className="btn s" onClick={notConnected}>Choose file</button><span className="mut">No file chosen</span></div>
              </div>
              <div className="row" style={{ justifyContent: 'flex-end' }}>
                <button className="btn" onClick={() => setReport({ ...report, open: false })}>Cancel</button>
                <button className="btn p" onClick={notConnected}>Submit report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
