import { Outlet } from 'react-router-dom'
import { useFeedback } from '../components/ui/Feedback'
import { Brand, NavButton } from './NavButton'

const MENUS = {
  owner: {
    title: 'Owner workspace', name: 'Le Thanh Hung', role: 'Pine Hill Camping', ini: 'LH',
    items: [
      ['/owner', 'Dashboard'], ['/owner/campsites', 'My campsites'], ['/owner/campsites/new', 'Create / edit campsite'],
      ['/owner/availability', 'Availability & capacity'], ['/owner/bookings', 'Booking management'],
      ['/owner/check-in', 'Check-in / check-out'], ['/owner/verification', 'Verification documents'],
      ['/owner/profile', 'Profile & settings'],
    ],
  },
  admin: {
    title: 'Administration', name: 'Vo Quoc Dat', role: 'Administrator', ini: 'VD',
    items: [
      ['/admin', 'Dashboard'], ['/admin/users', 'User management'], ['/admin/campsites', 'Campsite management'],
      ['/admin/verification', 'Campsite verification'], ['/admin/reports', 'Reports & complaints'],
      ['/admin/reviews', 'Review moderation'], ['/admin/announcements', 'Announcements'],
    ],
  },
} as const

/** Owner and admin areas: dark sidebar instead of the top header. */
export default function WorkspaceLayout({ role }: { role: keyof typeof MENUS }) {
  const m = MENUS[role]
  const { notConnected } = useFeedback()
  return (
    <div className="body">
      <aside className="side">
        <Brand light style={{ padding: '6px 10px 14px' }} />
        <div className="sh">{m.title}</div>
        {m.items.map(([to, label]) => (
          <NavButton key={to} to={to}>{label}</NavButton>
        ))}
        <div className="sh">Signed in</div>
        <div style={{ display: 'flex', gap: 9, alignItems: 'center', padding: '4px 12px 10px' }}>
          <span className="av" style={{ background: '#E4EFE8', color: '#0D2B1E' }}>{m.ini}</span>
          <span style={{ fontSize: 13 }}>{m.name}<br /><span style={{ color: '#86A596', fontSize: 12 }}>{m.role}</span></span>
        </div>
        <button onClick={notConnected} style={{ color: '#9FB6AA' }}>Log out</button>
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}
