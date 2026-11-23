import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { DEFAULT_SEARCH, getFilterOptions, getHome } from '../../api/campsites'
import { getFavoriteIds } from '../../api/community'
import { CampsiteCard } from '../../components/campsite/CampsiteCard'
import { openChatWidget } from '../../components/chat/ChatWidget'
import { fmtDate, initials } from '../../utils/format'

export async function loader() {
  const [home, options, favorites] = await Promise.all([getHome(), getFilterOptions(), getFavoriteIds()])
  return { ...home, provinces: options.provinces, favorites }
}

const NOTES: Record<string, string> = {
  'Lam Dong (Da Lat)': 'Pine forest, lakes and cold mornings',
  'Vung Tau': 'Beachfront weekends from Ho Chi Minh City',
  'Ninh Binh': 'Karst cliffs and rice field valleys',
  'Ha Giang': 'Mountain passes and terraced rice',
  'Binh Thuan': 'Dunes, capes and warm sea',
}
const HUES: Record<string, string> = {
  'Lam Dong (Da Lat)': '#2F5D3A', 'Vung Tau': '#1F6B6B', 'Ninh Binh': '#3C6B2E', 'Ha Giang': '#4A5E2A', 'Binh Thuan': '#8A6A2E',
}
const EXPERIENCES = [
  { ab: 'FM', name: 'Forest & mountain', note: 'Pine ridges, highland passes and cool nights' },
  { ab: 'BF', name: 'Beachfront', note: 'Pitch behind the dunes, wake up to the sea' },
  { ab: 'LK', name: 'Lakeside', note: 'Still water, kayaks and sunrise mist' },
  { ab: 'GL', name: 'Glamping', note: 'Safari tents with beds and hot breakfast' },
]
const BENEFITS = [
  { t: 'Real availability', d: 'Owners keep a live calendar, so the capacity you see is the capacity that is left.' },
  { t: 'Verified campsites', d: 'Approved sites have had their documents checked by a VietCamp administrator.' },
  { t: 'No payment online', d: 'You send a request, the owner accepts, and you settle on site. Nothing is charged here.' },
  { t: 'Reviews you can trust', d: 'Only campers whose stay was completed can review, one review per booking.' },
]

export default function HomePage() {
  const d = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [search, setSearch] = useState({ prov: 'all', ...DEFAULT_SEARCH })
  const toSearch = () => navigate('/search')

  return (
    <div id="top">
      <section className="hero">
        <div className="in">
          <span className="bg" style={{ background: '#1B5740', borderColor: '#2E6B52', color: '#C9E3D5' }}>1,248 campsites · 6 regions · verified owners</span>
          <h1 style={{ fontSize: 46, margin: '16px 0 12px', maxWidth: 760, color: '#fff' }}>Find your next campsite in Vietnam — from the pine hills of Da Lat to the karst valleys of Ninh Binh.</h1>
          <p style={{ maxWidth: 620, color: '#C9DDD3', fontSize: 17 }}>Search real availability, compare facilities and capacity, then send a booking request directly to the campsite owner. No payment online — the owner confirms your stay.</p>
          <div className="sbar" style={{ marginTop: 26, maxWidth: 960 }}>
            <div className="fld"><span className="lbl">Where to</span>
              <select className="inp" value={search.prov} onChange={(e) => setSearch({ ...search, prov: e.target.value })}>
                <option value="all">Anywhere in Vietnam</option>
                {d.provinces.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="fld"><span className="lbl">Check-in</span><input className="inp" type="date" value={search.from} onChange={(e) => setSearch({ ...search, from: e.target.value })} /></div>
            <div className="fld"><span className="lbl">Check-out</span><input className="inp" type="date" value={search.to} onChange={(e) => setSearch({ ...search, to: e.target.value })} /></div>
            <div className="fld" style={{ flex: '0 1 130px' }}><span className="lbl">Guests</span><input className="inp" type="number" min="1" max="60" value={search.guests} onChange={(e) => setSearch({ ...search, guests: Number(e.target.value) })} /></div>
            <div className="fld" style={{ flex: '0 0 auto', justifyContent: 'flex-end' }}><button className="btn p" style={{ minWidth: 132 }} onClick={toSearch}>Search campsites</button></div>
          </div>
          <p className="mut" style={{ color: '#9FB6AA', marginTop: 12 }}>Popular right now: Da Lat pine forest · Vung Tau beachfront · Ha Giang mountain terraces</p>
        </div>
      </section>

      <div className="wrap">
        <div className="sec"><h2>Featured campsites</h2><span className="sub">Hand-picked, verified and consistently well reviewed</span>
          <button className="btn s mla" onClick={toSearch}>See all campsites</button></div>
        <div className="grid g3">
          {d.featured.map((c) => <CampsiteCard key={c.id} site={c} fav={d.favorites.includes(c.id)} />)}
        </div>

        <div className="sec" style={{ marginTop: 44 }}><h2>Popular camping destinations</h2><span className="sub">Where Vietnamese campers are heading this season</span></div>
        <div className="grid g3">
          {d.destinations.map((x) => (
            <button key={x.name} className="sc" style={{ cursor: 'pointer' }} onClick={toSearch}>
              <div className="ph" style={{ background: HUES[x.name], height: 150 }}><span className="pl">{x.count} campsites</span></div>
              <div className="bd"><div className="nmr"><span className="nm">{x.name}</span></div><div className="mut">{NOTES[x.name]}</div></div>
            </button>
          ))}
        </div>

        <div className="sec" style={{ marginTop: 44 }}><h2>Recommended for you</h2><span className="sub">Based on your saved campsites and past stays</span>
          <button className="btn s mla" onClick={() => navigate('/chat')}>Ask the AI assistant</button></div>
        <div className="grid g3">
          {d.recommended.map((c) => <CampsiteCard key={c.id} site={c} variant="compact" fav={d.favorites.includes(c.id)} />)}
        </div>

        <div className="sec" style={{ marginTop: 44 }}><h2>Camping experiences</h2><span className="sub">Pick the kind of trip you want</span></div>
        <div className="grid g4">
          {EXPERIENCES.map((k) => (
            <button key={k.ab} className="card pad" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={toSearch}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: '#E4EFE8', color: '#13412E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{k.ab}</div>
              <h4 style={{ marginTop: 12 }}>{k.name}</h4>
              <p className="mut" style={{ marginTop: 5 }}>{k.note}</p>
            </button>
          ))}
        </div>

        <div className="grid g2" style={{ marginTop: 44 }}>
          <div className="card pad24">
            <span className="bg ok">Approved campsite</span>
            <h3 style={{ marginTop: 12 }}>What approval means</h3>
            <p className="lead" style={{ marginTop: 8 }}>The owner submitted business and safety documents, an administrator reviewed them, and the campsite re-confirms it is still active every three months.</p>
            <ul className="mut" style={{ margin: '12px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
              <li>Identity and operating documents checked</li>
              <li>Capacity and facilities confirmed by the owner</li>
              <li>Reviews only from campers with a completed stay</li>
            </ul>
          </div>
          <div className="card pad24">
            <span className="bg mu">Not approved yet</span>
            <h3 style={{ marginTop: 12 }}>Listed but unverified</h3>
            <p className="lead" style={{ marginTop: 8 }}>These campsites are visible so you can discover them, but their documents are pending, missing or were rejected. Information comes from the owner and has not been checked.</p>
            <ul className="mut" style={{ margin: '12px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
              <li>Booking requests still work — the owner decides</li>
              <li>Details may be out of date; you can report a listing</li>
              <li>Filter them out any time with the verification filter</li>
            </ul>
          </div>
        </div>

        <div className="sec" style={{ marginTop: 44 }}><h2>Why campers use VietCamp</h2></div>
        <div className="grid g4">
          {BENEFITS.map((b) => (
            <div key={b.t} className="card pad"><h4>{b.t}</h4><p className="mut" style={{ marginTop: 6 }}>{b.d}</p></div>
          ))}
        </div>

        <div className="sec" style={{ marginTop: 44 }}><h2>What campers say</h2><span className="sub">Reviews from stays completed through VietCamp</span>
          <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={toSearch}>Read more reviews</button></div>
        <div className="grid g3">
          {d.testimonials.map((t) => (
            <div key={t.id} className="card quote">
              <span className="qm">“</span>
              <p>{t.text}</p>
              <div className="row" style={{ gap: 10, marginTop: 'auto' }}>
                <span className="av">{initials(t.author)}</span>
                <span><b style={{ fontSize: 13.5 }}>{t.author}</b><div className="mut">{t.siteName} · {fmtDate(t.date)}</div></span>
                <span className="star mla" style={{ marginLeft: 'auto' }}>★ {t.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ctaband" style={{ marginTop: 36 }}>
          <div style={{ flex: '1 1 420px' }}>
            <span className="bg" style={{ background: '#1B5740', borderColor: '#2E6B52', color: '#C9E3D5' }}>AI assistant</span>
            <h2 style={{ marginTop: 12, color: '#fff' }}>“A quiet campsite near Da Lat for 4 people, under 800,000&nbsp;₫, with hot showers.”</h2>
            <p style={{ marginTop: 10, color: '#C9DDD3' }}>Describe your trip in plain Vietnamese or English. The assistant turns it into filters and only ever returns campsites that exist in the VietCamp directory. It travels with you — tap the badge in the bottom right corner on any page.</p>
          </div>
          <div className="col" style={{ gap: 10 }}>
            <button className="btn a" style={{ minHeight: 48 }} onClick={openChatWidget}>Open the mini assistant</button>
            <button className="btn" onClick={() => navigate('/chat')}>Full assistant page</button>
          </div>
        </div>

        <div className="grid g2" style={{ marginTop: 20 }}>
          <div className="card pad24" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3>Own a campsite?</h3>
            <p className="lead">List it free, keep one calendar for every night of the year, and decide every booking request yourself. Submit your documents once to earn the approved badge.</p>
            <div className="row" style={{ marginTop: 'auto' }}><button className="btn p" onClick={() => navigate('/register')}>List your campsite</button><button className="btn g" onClick={() => navigate('/login')}>Owner login</button></div>
          </div>
          <div className="card pad24" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3>Camping in Vietnam, planned properly</h3>
            <p className="lead">Compare {d.siteCount} campsites across {d.provCount} regions, check real remaining capacity for your dates, and send a request in under a minute. No payment online.</p>
            <div className="row" style={{ marginTop: 'auto' }}><button className="btn p" onClick={toSearch}>Start searching</button><button className="btn g" onClick={() => navigate('/map')}>Open the map</button></div>
          </div>
        </div>
      </div>
    </div>
  )
}
