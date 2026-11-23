import { useLocation, useNavigate } from 'react-router-dom'

const ROLES = [
  { label: 'Guest', to: '/', area: '' },
  { label: 'Camper', to: '/me', area: '/me' },
  { label: 'Campsite owner', to: '/owner', area: '/owner' },
  { label: 'Administrator', to: '/admin', area: '/admin' },
]

/** Dev-only role switcher (the prototype's demo bar); there is no real login until the backend exists. */
export function DemoBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const current = ROLES.slice(1).find((r) => pathname.startsWith(r.area))?.label ?? 'Guest'
  return (
    <div className="demobar" style={{ position: 'static' }}>
      <span className="lg">VietCamp</span>
      <span className="dim">Static UI preview · mock data · view as:</span>
      <div className="roles">
        {ROLES.map((r) => (
          <button key={r.label} className={r.label === current ? 'rbtn on' : 'rbtn'} onClick={() => navigate(r.to)}>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}
