import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CampsiteSummary } from '../../types/models'
import { vnd } from '../../utils/format'
import { useFeedback } from '../ui/Feedback'
import { VerBadge } from '../ui/Badges'

export function FavButton({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  const { toast } = useFeedback()
  return (
    <button
      className={on ? 'fav on' : 'fav'}
      aria-label="Save to favorites"
      onClick={() => {
        setOn(!on)
        toast(on ? 'Removed from favorites' : 'Saved to favorites')
      }}
    >
      ♥
    </button>
  )
}

interface Props {
  site: CampsiteSummary
  fav?: boolean
  /** full: facilities + capacity (featured); search: full + availability + booking button; compact: name, rating, price */
  variant?: 'full' | 'search' | 'compact'
  photoHeight?: number
}

export function CampsiteCard({ site: c, fav = false, variant = 'full', photoHeight }: Props) {
  const navigate = useNavigate()
  const detailed = variant !== 'compact'
  return (
    <div className="sc">
      <div className="ph" style={{ background: c.hue, height: photoHeight }}>
        <div className="tl"><VerBadge ver={c.ver} /></div>
        <div className="tr"><FavButton initial={fav} /></div>
        <span className="pl">{c.prov}</span>
      </div>
      <div className="bd">
        <div className="nmr">
          <span className="nm">{c.name}</span>
          <span className="star" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            ★ {c.rating.toFixed(1)} {detailed && <span className="mut">({c.nrev})</span>}
          </span>
        </div>
        <div className="mut">{c.addr}</div>
        {detailed && (
          <div className="row" style={{ gap: 6 }}>
            {c.fac.slice(0, 3).map((x) => <span key={x} className="pill">{x}</span>)}
          </div>
        )}
        {variant === 'search' && (
          <div className="mut">
            {c.placesLeft > 0 ? `${c.placesLeft} of ${c.cap} places free on your dates` : 'Full on your dates — try other nights'}
          </div>
        )}
        <div className="pr">
          <b>{vnd(c.price)}</b>
          <span className="mut">{detailed ? `/ night · up to ${c.cap} guests` : '/ night'}</span>
        </div>
        {variant === 'search' ? (
          <div className="row" style={{ gap: 8 }}>
            <button className="btn s" style={{ flex: 1 }} onClick={() => navigate(`/campsites/${c.id}`)}>View details</button>
            <button className="btn p s" style={{ flex: 1 }} onClick={() => navigate(`/campsites/${c.id}/book`)}>Request booking</button>
          </div>
        ) : (
          <button className="btn s w" onClick={() => navigate(`/campsites/${c.id}`)}>View details</button>
        )}
      </div>
    </div>
  )
}
