import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { getOwnerSiteCount } from '../../api/owner'
import { getOwnerProfile } from '../../api/profile'
import { useFeedback } from '../../components/ui/Feedback'

export async function loader() {
  const [profile, sites] = await Promise.all([getOwnerProfile(), getOwnerSiteCount()])
  return { profile, sites }
}

const TABS = [['info', 'Business information'], ['security', 'Account & password'], ['notif', 'Notifications']] as const
const NOTIFS = [
  ['New booking requests', 'Email and in-app as soon as a request arrives'],
  ['Cancellations', 'When a camper cancels a confirmed booking'],
  ['Verification decisions', 'Approvals and rejections from administrators'],
  ['New reviews', 'When a completed stay is reviewed'],
  ['Activity reminders', 'The three-month campsite confirmation reminder'],
]

export default function OwnerProfilePage() {
  const { profile, sites } = useLoaderData<typeof loader>()
  const { notConnected } = useFeedback()
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('info')
  const [p, setP] = useState(profile)
  const [pw, setPw] = useState({ old: '', next: '', next2: '' })
  const set = (k: 'biz' | 'name' | 'email' | 'phone' | 'addr' | 'tax' | 'about') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value })
  const toggle = (label: string) => setP({ ...p, notifications: p.notifications.includes(label) ? p.notifications.filter((x) => x !== label) : [...p.notifications, label] })

  return (
    <div className="wrap" style={{ maxWidth: 1000 }}>
      <h1 style={{ fontSize: 27 }}>Owner profile &amp; settings</h1>
      <p className="mut" style={{ marginTop: 6 }}>Business details shown to campers, plus your account settings.</p>
      <div className="tabs" style={{ marginTop: 18 }}>
        {TABS.map(([key, label]) => <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>{label}</button>)}
      </div>

      {tab === 'info' && (
        <div className="body" style={{ gap: 22, alignItems: 'flex-start' }}>
          <aside style={{ flex: '0 0 280px' }}>
            <div className="card pad24" style={{ textAlign: 'center' }}>
              <span className="av" style={{ width: 88, height: 88, fontSize: 26, margin: '0 auto', background: 'var(--forest)', color: '#F3E8CF' }}>PH</span>
              <h4 style={{ marginTop: 12 }}>{p.biz}</h4>
              <p className="mut">Owner since 2024 · {sites} campsites</p>
              <button className="btn s" style={{ marginTop: 12 }} onClick={notConnected}>Change logo</button>
            </div>
          </aside>
          <div className="main" style={{ flex: '999 1 420px' }}>
            <div className="card pad24">
              <h3>Business information</h3>
              <div className="col" style={{ gap: 14, marginTop: 14 }}>
                <div className="row" style={{ gap: 14 }}>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Business / campsite brand *</span><input className="inp" type="text" value={p.biz} onChange={set('biz')} /></div>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Owner full name *</span><input className="inp" type="text" value={p.name} onChange={set('name')} /></div>
                </div>
                <div className="row" style={{ gap: 14 }}>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Email *</span><input className="inp" type="email" value={p.email} onChange={set('email')} /></div>
                  <div className="fld" style={{ flex: 1 }}><span className="lbl">Phone *</span><input className="inp" type="tel" value={p.phone} onChange={set('phone')} /></div>
                </div>
                <div className="fld"><span className="lbl">Business address</span><input className="inp" type="text" value={p.addr} onChange={set('addr')} /></div>
                <div className="fld"><span className="lbl">Tax code</span><input className="inp" type="text" value={p.tax} onChange={set('tax')} /></div>
                <div className="fld"><span className="lbl">About the business</span><textarea className="inp" value={p.about} onChange={set('about')}></textarea></div>
                <div className="row"><button className="btn p" onClick={notConnected}>Save changes</button><button className="btn g" onClick={() => setP(profile)}>Discard</button></div>
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
            <div className="fld"><span className="lbl">New password *</span><input className="inp" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
            <div className="fld"><span className="lbl">Confirm new password *</span><input className="inp" type="password" value={pw.next2} onChange={(e) => setPw({ ...pw, next2: e.target.value })} /></div>
            <button className="btn p" onClick={notConnected}>Update password</button>
          </div>
          <div className="hr"></div>
          <div className="kv">
            <span className="k">Account status</span><span><span className="bg ok">Active</span></span>
            <span className="k">Role</span><span>Campsite owner</span>
            <span className="k">Campsites</span><span>{sites}</span>
          </div>
        </div>
      )}

      {tab === 'notif' && (
        <div className="card pad24" style={{ maxWidth: 620 }}>
          <h3>Notification settings</h3>
          <div className="col" style={{ gap: 10, marginTop: 14 }}>
            {NOTIFS.map(([label, note]) => (
              <label key={label} className="chk" style={{ padding: '12px 14px' }}>
                <input type="checkbox" checked={p.notifications.includes(label)} onChange={() => toggle(label)} />
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
