import { useState } from 'react'
import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom'
import { getCampsiteForm } from '../../api/owner'
import { SiteMap } from '../../components/map/CampsiteMap'
import { VerBadge, ListingBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { vnd } from '../../utils/format'

export async function loader({ params }: LoaderFunctionArgs) {
  return getCampsiteForm(params.id)
}

const PHOTO_HUES = ['#2F5D3A', '#3E6B4F', '#6B5A38', '#2B4A5E']
const DOC_STATUS: Record<string, [string, string]> = { approved: ['bg ok', 'Approved'], pending: ['bg wa', 'Pending'], rejected: ['bg er', 'Rejected'] }

export default function CampsiteFormPage() {
  const { site: s, docs, options } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected, confirm } = useFeedback()
  const [c, setC] = useState({
    name: s?.name ?? '', desc: s?.desc ?? '', cat: s?.cat ?? options.categories[0], area: s?.area ?? '',
    prov: s?.prov ?? options.provinces[0], district: s?.district ?? '', addr: s?.addr ?? '',
    lat: s ? String(s.lat) : '', lng: s ? String(s.lng) : '',
    price: s ? String(s.price) : '', cap: s ? String(s.cap) : '', minN: '1',
    facs: s?.fac ?? [], accs: s?.acc ?? [],
    photos: s ? ['Main view', 'Tent area', 'Facilities'] : [],
  })
  const set = (k: 'name' | 'desc' | 'cat' | 'area' | 'prov' | 'district' | 'addr' | 'lat' | 'lng' | 'price' | 'cap' | 'minN') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setC({ ...c, [k]: e.target.value })
  const toggle = (k: 'facs' | 'accs', label: string) => setC({ ...c, [k]: c[k].includes(label) ? c[k].filter((x) => x !== label) : [...c[k], label] })
  const listing = s?.listing ?? 'draft'
  const ver = s?.ver ?? 'none'
  const lat = Number(c.lat)
  const lng = Number(c.lng)
  const hasPos = !!c.lat && !!c.lng && !Number.isNaN(lat) && !Number.isNaN(lng)

  return (
    <div className="wrap" style={{ maxWidth: 1080 }}>
      <button className="bk" onClick={() => navigate('/owner/campsites')}>← Back to my campsites</button>
      <div className="sec" style={{ marginTop: 8 }}>
        <div><h1 style={{ fontSize: 27 }}>{s ? 'Edit campsite' : 'Create a campsite'}</h1>
          <p className="mut" style={{ marginTop: 6 }}>{s ? 'Changes go live as soon as you save. Verification is unaffected.' : 'Fill in the details, then publish or keep it as a draft.'}</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}><ListingBadge listing={listing} /></div>
      </div>

      <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
        <div className="main" style={{ flex: '999 1 520px' }}>
          <div className="card pad24">
            <h3>Basic information</h3>
            <div className="col" style={{ gap: 14, marginTop: 14 }}>
              <div className="fld"><span className="lbl">Campsite name *</span><input className="inp" type="text" placeholder="Pine Hill Camping — Lake View" value={c.name} onChange={set('name')} /></div>
              <div className="fld"><span className="lbl">Short description *</span><textarea className="inp" placeholder="What makes this campsite special? Terrain, views, atmosphere, nearby attractions." value={c.desc} onChange={set('desc')}></textarea></div>
              <div className="row" style={{ gap: 14 }}>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Experience type</span>
                  <select className="inp" value={c.cat} onChange={set('cat')}>{options.categories.map((x) => <option key={x} value={x}>{x}</option>)}</select>
                </div>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Area size</span><input className="inp" type="text" placeholder="2.4 ha" value={c.area} onChange={set('area')} /></div>
              </div>
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Location</h3>
            <div className="col" style={{ gap: 14, marginTop: 14 }}>
              <div className="row" style={{ gap: 14 }}>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Province / city *</span>
                  <select className="inp" value={c.prov} onChange={set('prov')}>{options.provinces.map((p) => <option key={p} value={p}>{p}</option>)}</select>
                </div>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">District / ward</span><input className="inp" type="text" value={c.district} onChange={set('district')} /></div>
              </div>
              <div className="fld"><span className="lbl">Full address *</span><input className="inp" type="text" placeholder="Street, hamlet, commune" value={c.addr} onChange={set('addr')} /></div>
              <div className="row" style={{ gap: 14 }}>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Latitude</span><input className="inp" type="text" placeholder="11.9404" value={c.lat} onChange={set('lat')} /></div>
                <div className="fld" style={{ flex: 1 }}><span className="lbl">Longitude</span><input className="inp" type="text" placeholder="108.4583" value={c.lng} onChange={set('lng')} /></div>
              </div>
              <p className="mut">Coordinates place your marker on the discovery map. Campers see the area, not a driving route.</p>
              {hasPos && <SiteMap lat={lat} lng={lng} zoom={12} name={c.name || 'Your campsite name'} addr={c.addr} />}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Pricing and capacity</h3>
            <div className="row" style={{ gap: 14, marginTop: 14 }}>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Price per night (₫) *</span><input className="inp" type="number" step="50000" min="0" value={c.price} onChange={set('price')} /></div>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Maximum capacity (guests) *</span><input className="inp" type="number" min="1" max="500" value={c.cap} onChange={set('cap')} /></div>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Minimum nights</span><input className="inp" type="number" min="1" max="14" value={c.minN} onChange={set('minN')} /></div>
            </div>
            <p className="mut" style={{ marginTop: 10 }}>Capacity is enforced per night: VietCamp blocks any request that would exceed it, including simultaneous requests.</p>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Facilities and services</h3>
            <div className="grid g3" style={{ gap: 9, marginTop: 14 }}>
              {options.facilities.map((x) => (
                <label key={x} className="chk"><input type="checkbox" checked={c.facs.includes(x)} onChange={() => toggle('facs', x)} /><span>{x}</span></label>
              ))}
            </div>
            <div className="hr"></div>
            <h4>Accessibility</h4>
            <div className="grid g2" style={{ gap: 9, marginTop: 12 }}>
              {options.accessibility.map((x) => (
                <label key={x} className="chk"><input type="checkbox" checked={c.accs.includes(x)} onChange={() => toggle('accs', x)} /><span>{x}</span></label>
              ))}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Photos</h3>
            <div className="up" style={{ marginTop: 14 }}>
              <b>Drag images here or choose files</b>
              <span className="mut">JPG or PNG, at least 1200×800, up to 10 images</span>
              <button className="btn s" onClick={notConnected}>Choose images</button>
            </div>
            <div className="row" style={{ gap: 10, marginTop: 14 }}>
              {c.photos.map((label, i) => (
                <span key={label} className="ph" style={{ background: PHOTO_HUES[i % 4], width: 118, height: 84, borderRadius: 9 }}>
                  <span className="pl">{label}</span>
                  <span className="tr"><button className="fav" onClick={() => setC({ ...c, photos: c.photos.filter((p) => p !== label) })} aria-label="Remove image">×</button></span>
                </span>
              ))}
            </div>
          </div>

          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Campsite documents</h3>
            <p className="mut" style={{ marginTop: 6 }}>Business licence, land-use document, fire-safety certificate. Needed for the approved badge.</p>
            <div className="col" style={{ gap: 10, marginTop: 14 }}>
              {docs.map((d) => (
                <div key={d.name} className="doc"><span className="fi">{d.ext}</span><span style={{ flex: 1 }}><b>{d.name}</b><div className="mut">{d.meta}</div></span><span className={DOC_STATUS[d.status][0]}>{DOC_STATUS[d.status][1]}</span></div>
              ))}
            </div>
            <button className="btn" style={{ marginTop: 12 }} onClick={() => navigate('/owner/verification')}>Go to verification documents</button>
          </div>
        </div>

        <aside style={{ flex: '0 0 310px' }}>
          <div className="card pad24">
            <h3>Publish</h3>
            <div className="kv" style={{ marginTop: 12 }}>
              <span className="k">Listing status</span><span><ListingBadge listing={listing} /></span>
              <span className="k">Verification</span><span><VerBadge ver={ver} /></span>
              <span className="k">Visible on map</span><span>{listing === 'listed' ? 'Yes, as a registered campsite' : 'No, drafts are hidden'}</span>
            </div>
            <div className="col" style={{ gap: 9, marginTop: 16 }}>
              <button className="btn p w" onClick={notConnected}>{s ? 'Save and publish' : 'Create and publish'}</button>
              <button className="btn w" onClick={notConnected}>Save as draft</button>
              {s && <button className="btn d w" onClick={() => confirm({ title: `Delete ${s.name}?`, body: 'The listing, its calendar and photos are removed. Existing bookings must be cancelled first.', ok: 'Delete campsite', danger: true })}>Delete campsite</button>}
            </div>
            <div className="hr"></div>
            <p className="mut">Required fields: name, description, province, address, price and capacity.</p>
          </div>
          <div className="card pad24" style={{ marginTop: 18 }}>
            <h3>Live preview</h3>
            <div className="sc" style={{ marginTop: 12, boxShadow: 'none' }}>
              <div className="ph" style={{ background: s?.hue ?? '#2F5D3A', height: 110 }}><span className="pl">{c.prov}</span><div className="tl"><VerBadge ver={ver} /></div></div>
              <div className="bd" style={{ padding: 12 }}>
                <b>{c.name || 'Your campsite name'}</b>
                <span className="mut">{c.addr || 'Address appears here'}</span>
                <div className="pr"><b>{c.price ? vnd(Number(c.price)) : '0 ₫'}</b><span className="mut">/ night · up to {c.cap || 0} guests</span></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
