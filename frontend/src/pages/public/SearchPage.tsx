import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { DEFAULT_SEARCH, getFilterOptions, listCampsites } from '../../api/campsites'
import { getFavoriteIds } from '../../api/community'
import { CampsiteCard } from '../../components/campsite/CampsiteCard'
import { useFeedback } from '../../components/ui/Feedback'
import { fmtDate, nightsBetween } from '../../utils/format'

export async function loader() {
  const [results, options, favorites] = await Promise.all([listCampsites(), getFilterOptions(), getFavoriteIds()])
  return { results, options, favorites }
}

const PER_PAGE = 6

// Static UI: filter and sort controls are shown but do not filter yet — the backend search endpoint will.
export default function SearchPage() {
  const { results, options, favorites } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const [f, setF] = useState({ prov: 'all', q: '', sort: 'rel', pmin: '', pmax: '', rate: '0', cap: '0', cat: 'all', ver: 'all', ...DEFAULT_SEARCH })
  const [checked, setChecked] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })
  const toggle = (label: string) => setChecked(checked.includes(label) ? checked.filter((x) => x !== label) : [...checked, label])

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE))
  const shown = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const left = results.length - page * PER_PAGE
  const where = f.prov === 'all' ? 'Vietnam' : f.prov

  return (
    <div className="wrap">
      <div className="sbar" style={{ marginBottom: 20 }}>
        <div className="fld" style={{ flex: '1 1 220px' }}><span className="lbl">Where to</span>
          <select className="inp" value={f.prov} onChange={set('prov')}>
            <option value="all">Anywhere in Vietnam</option>
            {options.provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="fld"><span className="lbl">Keyword</span><input className="inp" type="search" placeholder="Campsite name, facility, area" value={f.q} onChange={set('q')} /></div>
        <div className="fld"><span className="lbl">Check-in</span><input className="inp" type="date" value={f.from} onChange={set('from')} /></div>
        <div className="fld"><span className="lbl">Check-out</span><input className="inp" type="date" value={f.to} onChange={set('to')} /></div>
        <div className="fld" style={{ flex: '0 1 120px' }}><span className="lbl">Guests</span><input className="inp" type="number" min="1" max="60" value={f.guests} onChange={set('guests')} /></div>
        <div className="fld" style={{ flex: '0 0 auto', justifyContent: 'flex-end' }}><button className="btn p" onClick={notConnected}>Search</button></div>
      </div>

      <div className="sec">
        <div>
          <h1 style={{ fontSize: 27 }}>{results.length} campsite{results.length === 1 ? '' : 's'} in {where}</h1>
          <p className="mut" style={{ marginTop: 6 }}>
            {fmtDate(f.from)} → {fmtDate(f.to)} · {f.guests} guests · {nightsBetween(f.from, f.to)} nights{f.q && ` · keyword "${f.q}"`}
          </p>
        </div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 190px' }}><span className="lbl">Sort by</span>
            <select className="inp" value={f.sort} onChange={set('sort')}>
              <option value="rel">Relevance</option>
              <option value="plo">Price: low to high</option>
              <option value="phi">Price: high to low</option>
              <option value="rate">Rating</option>
              <option value="cap">Capacity</option>
            </select>
          </div>
          <div className="fld" style={{ flex: '0 0 auto' }}><span className="lbl">View</span>
            <div className="row" style={{ gap: 0 }}>
              <button className="btn p s" style={{ borderRadius: '10px 0 0 10px' }}>List</button>
              <button className="btn s" style={{ borderRadius: '0 10px 10px 0', borderLeft: 0 }} onClick={() => navigate('/map')}>Map</button>
            </div>
          </div>
        </div>
      </div>

      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <aside style={{ flex: '0 0 268px' }}>
          <div className="card pad">
            <div className="sec" style={{ marginBottom: 12 }}><h3>Filters</h3>
              <button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={() => { setF({ ...f, pmin: '', pmax: '', rate: '0', cap: '0', cat: 'all', ver: 'all' }); setChecked([]) }}>Reset</button>
            </div>
            <div className="col" style={{ gap: 16 }}>
              <div className="fld">
                <span className="lbl">Price per night (₫)</span>
                <div className="row" style={{ gap: 8 }}>
                  <input className="inp" type="number" step="50000" min="0" placeholder="Min" value={f.pmin} onChange={set('pmin')} />
                  <input className="inp" type="number" step="50000" min="0" placeholder="Max" value={f.pmax} onChange={set('pmax')} />
                </div>
              </div>
              <div className="fld"><span className="lbl">Minimum rating</span>
                <select className="inp" value={f.rate} onChange={set('rate')}>
                  <option value="0">Any rating</option><option value="3.5">3.5+</option><option value="4">4.0+</option><option value="4.5">4.5+</option>
                </select>
              </div>
              <div className="fld"><span className="lbl">Minimum capacity</span>
                <select className="inp" value={f.cap} onChange={set('cap')}>
                  <option value="0">Any size</option><option value="20">20+ guests</option><option value="40">40+ guests</option><option value="80">80+ guests</option>
                </select>
              </div>
              <div className="fld"><span className="lbl">Campsite type</span>
                <select className="inp" value={f.cat} onChange={set('cat')}>
                  <option value="all">All types</option>
                  {options.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="fld"><span className="lbl">Verification status</span>
                <select className="inp" value={f.ver} onChange={set('ver')}>
                  <option value="all">All campsites</option><option value="approved">Approved only</option><option value="pending">Pending review</option><option value="none">Not submitted</option>
                </select>
              </div>
              <div className="fld"><span className="lbl">Facilities &amp; services</span>
                {options.facilities.slice(0, 8).map((x) => (
                  <label key={x} className="chk"><input type="checkbox" checked={checked.includes(x)} onChange={() => toggle(x)} /><span>{x}</span></label>
                ))}
              </div>
              <div className="fld"><span className="lbl">Accessibility</span>
                {options.accessibility.map((x) => (
                  <label key={x} className="chk"><input type="checkbox" checked={checked.includes(x)} onChange={() => toggle(x)} /><span>{x}</span></label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          {results.length > 0 ? (
            <>
              <div className="grid g3">
                {shown.map((c) => <CampsiteCard key={c.id} site={c} variant="search" fav={favorites.includes(c.id)} />)}
              </div>
              {left > 0 && (
                <div className="row" style={{ justifyContent: 'center', marginTop: 22 }}>
                  <button className="btn" onClick={() => setPage(page + 1)}>Show more campsites ({left} left)</button>
                </div>
              )}
              <div className="pg">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>←</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={n === page ? 'on' : ''} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button onClick={() => setPage(page + 1)} disabled={page === pages}>→</button>
              </div>
            </>
          ) : (
            <div className="card empty">
              <span className="ic">⚲</span>
              <h3>No campsites match these filters</h3>
              <p className="mut" style={{ maxWidth: 420 }}>Try widening the price range, lowering the minimum rating, or including campsites that are not approved yet.</p>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn" onClick={notConnected}>Reset all filters</button>
                <button className="btn p" onClick={() => navigate('/chat')}>Ask the AI assistant</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
