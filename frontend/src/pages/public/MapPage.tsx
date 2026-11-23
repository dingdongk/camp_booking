import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { getFilterOptions, getMapPoints } from '../../api/campsites'
import { DiscoveryMap } from '../../components/map/CampsiteMap'
import { useFeedback } from '../../components/ui/Feedback'
import type { MapPoint } from '../../types/models'
import { VER } from '../../utils/labels'

export async function loader() {
  const [points, options] = await Promise.all([getMapPoints(), getFilterOptions()])
  return { points, provinces: options.provinces }
}

function verBadge(p: MapPoint): [string, string] {
  return p.ver === 'unregistered' ? ['bg mu', 'Unregistered spot'] : VER[p.ver]
}

function gmaps(p: MapPoint) {
  return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`
}

// Static UI: region / show selects are displayed but the backend will do the filtering.
export default function MapPage() {
  const { points, provinces } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { toast } = useFeedback()
  const [prov, setProv] = useState('all')
  const [show, setShow] = useState('all')
  const [selId, setSelId] = useState<string | null>('s1')
  const sel = points.find((p) => p.id === selId)
  const registered = points.filter((p) => p.registered).length

  return (
    <div className="wrap">
      <div className="sec">
        <div>
          <h1 style={{ fontSize: 27 }}>Campsite map</h1>
          <p className="mut" style={{ marginTop: 6 }}>{registered} registered campsites and {points.length - registered} community reported spots across Vietnam</p>
        </div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 190px' }}><span className="lbl">Region</span>
            <select className="inp" value={prov} onChange={(e) => setProv(e.target.value)}>
              <option value="all">Anywhere in Vietnam</option>
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="fld" style={{ flex: '0 0 190px' }}><span className="lbl">Show</span>
            <select className="inp" value={show} onChange={(e) => setShow(e.target.value)}>
              <option value="all">All locations</option>
              <option value="reg">Registered campsites</option>
              <option value="unreg">Unregistered spots</option>
              <option value="approved">Approved only</option>
            </select>
          </div>
          <div className="fld" style={{ flex: '0 0 auto' }}><span className="lbl">View</span>
            <div className="row" style={{ gap: 0 }}>
              <button className="btn s" style={{ borderRadius: '10px 0 0 10px' }} onClick={() => navigate('/search')}>List</button>
              <button className="btn p s" style={{ borderRadius: '0 10px 10px 0', borderLeft: 0 }}>Map</button>
            </div>
          </div>
        </div>
      </div>

      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 560px' }}>
          <DiscoveryMap points={points} selected={selId} onSelect={setSelId} />
          <div className="leg">
            <span><i style={{ background: '#17703F', borderColor: '#17703F' }}></i>Approved</span>
            <span><i style={{ background: '#8F4F12', borderColor: '#8F4F12' }}></i>Pending / rejected</span>
            <span><i style={{ background: '#6B7A72', borderColor: '#6B7A72' }}></i>Unregistered spot</span>
            <span>Leaflet + OpenStreetMap tiles. Drag to pan, scroll or use the controls to zoom. Discovery only — no route planning inside the platform.</span>
          </div>
        </div>
        <aside style={{ flex: '0 0 330px' }}>
          {sel && (
            <div className="card" style={{ overflow: 'hidden', marginBottom: 18 }}>
              <div className="ph" style={{ background: sel.hue, height: 104 }}>
                <span className="pl">{sel.prov}</span>
                <div className="tl"><span className={verBadge(sel)[0]}>{verBadge(sel)[1]}</span></div>
              </div>
              <div className="pad">
                <h4>{sel.name}</h4>
                <p className="mut" style={{ marginTop: 4 }}>{sel.addr}</p>
                <p className="mut" style={{ marginTop: 6 }}>{sel.info}</p>
                <div className="row" style={{ gap: 8, marginTop: 12 }}>
                  <button className="btn p s" style={{ flex: 1 }} disabled={!sel.registered} onClick={() => navigate(`/campsites/${sel.id}`)}>View details</button>
                  {sel.registered
                    ? <a className="btn s" href={gmaps(sel)} target="_blank" rel="noopener">Google Maps</a>
                    : <button className="btn s" onClick={() => toast('Unregistered spots have no listing to report')}>Report</button>}
                </div>
              </div>
            </div>
          )}
          <div className="card pad">
            <h3>Locations on this map ({points.length})</h3>
            <div className="col" style={{ gap: 10, marginTop: 12 }}>
              {points.map((m) => (
                <button key={m.id} className="card" style={{ display: 'flex', gap: 11, padding: 9, textAlign: 'left', cursor: 'pointer', alignItems: 'center', boxShadow: 'none' }} onClick={() => setSelId(m.id)}>
                  <span className="ph" style={{ background: m.hue, width: 58, height: 52, borderRadius: 9, flex: '0 0 58px' }}></span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, display: 'block' }}>{m.name}</span>
                    <span className="mut" style={{ display: 'block' }}>{m.addr}</span>
                    <span className={verBadge(m)[0]} style={{ marginTop: 4 }}>{verBadge(m)[1]}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
