import { useLoaderData, useNavigate } from 'react-router-dom'
import { listFavorites } from '../../api/community'
import { VerBadge } from '../../components/ui/Badges'
import { useFeedback } from '../../components/ui/Feedback'
import { vnd } from '../../utils/format'

export async function loader() {
  return { favorites: await listFavorites() }
}

export default function FavoritesPage() {
  const { favorites } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected } = useFeedback()

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>Favorite campsites</h1><p className="mut" style={{ marginTop: 6 }}>{favorites.length} campsite{favorites.length === 1 ? '' : 's'} saved for later</p></div>
        <button className="btn s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/search')}>Browse more campsites</button>
      </div>
      {favorites.length > 0 ? (
        <div className="grid g4">
          {favorites.map((c) => (
            <div key={c.id} className="sc">
              <div className="ph" style={{ background: c.hue }}>
                <div className="tl"><VerBadge ver={c.ver} /></div>
                <div className="tr"><button className="fav on" onClick={notConnected} aria-label="Remove from favorites">♥</button></div>
                <span className="pl">{c.prov}</span>
              </div>
              <div className="bd">
                <div className="nmr"><span className="nm">{c.name}</span><span className="star mla" style={{ marginLeft: 'auto' }}>★ {c.rating.toFixed(1)}</span></div>
                <div className="mut">{c.addr}</div>
                <div className="pr"><b>{vnd(c.price)}</b><span className="mut">/ night</span></div>
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn s" style={{ flex: 1 }} onClick={() => navigate(`/campsites/${c.id}`)}>Details</button>
                  <button className="btn s" onClick={notConnected}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty"><span className="ic">♥</span><h3>No favorites yet</h3><p className="mut" style={{ maxWidth: 400 }}>Tap the heart on any campsite card to keep it here for later.</p><button className="btn p" onClick={() => navigate('/search')}>Find campsites</button></div>
      )}
    </div>
  )
}
