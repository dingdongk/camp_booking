import type { ReactNode } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'

/** Prototype nav items are <button>s styled with `.on` when active; keep that markup. */
export function NavButton({ to, children, end = true }: { to: string; children: ReactNode; end?: boolean }) {
  const navigate = useNavigate()
  const active = useMatch({ path: to, end })
  return (
    <button className={active ? 'on' : ''} onClick={() => navigate(to)}>
      {children}
    </button>
  )
}

export function Brand({ light = false, style }: { light?: boolean; style?: React.CSSProperties }) {
  const navigate = useNavigate()
  return (
    <button className="brand" style={style} onClick={() => navigate('/')}>
      <span className="mk">VC</span>
      <span className="nm" style={light ? { color: '#F3E8CF' } : undefined}>VietCamp</span>
    </button>
  )
}
