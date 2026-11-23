import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { getCamperProfile } from '../../api/profile'
import { useFeedback } from '../../components/ui/Feedback'
import { initials } from '../../utils/format'

export async function loader() {
  return getCamperProfile()
}

const TABS = [['info', 'Personal information'], ['security', 'Account & password'], ['notif', 'Notifications']] as const
const NOTIFS = [
  ['Booking status changes', 'When an owner accepts, rejects or cancels'],
  ['Owner messages', 'Notes an owner adds to your booking'],
  ['Review reminders', 'When a completed stay can be reviewed'],
  ['New campsites near me', 'When a campsite opens in a region you saved'],
  ['Platform announcements', 'Safety notices and product updates'],
]

export default function ProfilePage() {
  const profile = useLoaderData<typeof loader>()
  const { notConnected, confirm } = useFeedback()
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('info')
  const [pf, setPf] = useState(profile)
  const [pw, setPw] = useState({ old: '', next: '', next2: '' })
  const set = (k: 'name' | 'dob' | 'email' | 'phone' | 'city' | 'bio') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPf({ ...pf, [k]: e.target.value })
  const toggle = (label: string) => setPf({ ...pf, notifications: pf.notifications.includes(label) ? pf.notifications.filter((x) => x !== label) : [...pf.notifications, label] })

  return (
    <div className="wrap" style={{ maxWidth: 1000 }}>
      <h1 style={{ fontSize: 27 }}>Profile &amp; settings</h1>
      <p className="mut" style={{ marginTop: 6 }}>Keep your contact details current — owners use them to reach you about a booking.</p>
      <div className="tabs" style={{ marginTop: 18 }}>
        {TABS.map(([key, label]) => <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label}</button>)}
      </div>

      {tab === 'info' && (
        <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
          <aside style={{ flex: '0 0 280px' }}>
            <div className="card pad24" style={{ textAlign: 'center' }}>
              <span className="av" style={{ width: 88, height: 88, fontSize: 28, margin: '0 auto' }}>{initials(pf.name)}</span>
              <h4 style={{ marginTop: 12 }}>{pf.name}</h4>
              <p className="mut">Camper since {pf.since}</p>
              <button className="btn s" style={{ marginTop: 12 }} onClick={notConnected}>Change photo</button>
              <p className="mut" style={{ marginTop: 8 }}>JPG or PNG, up to 4 MB</p>
            </div>
          </aside>
          <div className="main" style={{ flex: '999 1 420px' }}>
            <div className="card pad24">
              <h3>Personal information</h3>
              <div className="col" style={{ gap: 14, marginTop: 14 }}>
                <div className="row" style={{ gap: 14 }}>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Full name *</span><input className="inp" type="text" value={pf.name} onChange={set('name')} /></div>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Date of birth</span><input className="inp" type="date" value={pf.dob} onChange={set('dob')} /></div>
                </div>
                <div className="row" style={{ gap: 14 }}>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Email *</span><input className="inp" type="email" value={pf.email} onChange={set('email')} /></div>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Phone *</span><input className="inp" type="tel" value={pf.phone} onChange={set('phone')} /></div>
                </div>
                <div className="fld"><span className="lbl">City / province</span><input className="inp" type="text" value={pf.city} onChange={set('city')} /></div>
                <div className="fld"><span className="lbl">About me</span><textarea className="inp" value={pf.bio} onChange={set('bio')}></textarea></div>
                <div className="row"><button className="btn p" onClick={notConnected}>Save changes</button><button className="btn g" onClick={() => setPf(profile)}>Discard</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="card pad24" style={{ maxWidth: 560 }}>
          <h3>Change password</h3>
          <div className="col" style={{ gap: 14, marginTop: 14 }}>
            <div className="fld"><span className="lbl">Current password *</span><input className="inp" type="password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} /></div>
            <div className="fld"><span className="lbl">New password *</span><input className="inp" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /><span className="mut">At least 8 characters</span></div>
            <div className="fld"><span className="lbl">Confirm new password *</span><input className="inp" type="password" value={pw.next2} onChange={(e) => setPw({ ...pw, next2: e.target.value })} /></div>
            <button className="btn p" onClick={notConnected}>Update password</button>
          </div>
          <div className="hr"></div>
          <h3>Account</h3>
          <div className="kv" style={{ marginTop: 12 }}>
            <span className="k">Account status</span><span><span className="bg ok">Active</span></span>
            <span className="k">Role</span><span>Camper</span>
            <span className="k">Member since</span><span>{pf.since}</span>
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn d" onClick={() => confirm({ title: 'Deactivate your account?', body: 'Pending bookings are cancelled and you can no longer log in.', ok: 'Deactivate', danger: true })}>Deactivate my account</button>
          </div>
        </div>
      )}

      {tab === 'notif' && (
        <div className="card pad24" style={{ maxWidth: 620 }}>
          <h3>Notification preferences</h3>
          <p className="mut" style={{ marginTop: 6 }}>Choose what VietCamp tells you about.</p>
          <div className="col" style={{ gap: 10, marginTop: 14 }}>
            {NOTIFS.map(([label, note]) => (
              <label key={label} className="chk" style={{ padding: '12px 14px' }}>
                <input type="checkbox" checked={pf.notifications.includes(label)} onChange={() => toggle(label)} />
                <span><b>{label}</b><br /><span className="mut">{note}</span></span>
              </label>
            ))}
          </div>
          <div className="row" style={{ marginTop: 16 }}><button className="btn p" onClick={notConnected}>Save preferences</button></div>
        </div>
      )}
    </div>
  )
}
