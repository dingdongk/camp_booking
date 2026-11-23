import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeedback } from '../../components/ui/Feedback'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const [r, setR] = useState({ role: 'Camper', name: '', phone: '', email: '', pw: '', pw2: '', biz: '', terms: false, show: false })
  const set = (k: 'name' | 'phone' | 'email' | 'pw' | 'pw2' | 'biz') => (e: React.ChangeEvent<HTMLInputElement>) => setR({ ...r, [k]: e.target.value })
  const pwType = r.show ? 'text' : 'password'

  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <div className="card pad24" style={{ marginTop: 18 }}>
        <h1 style={{ fontSize: 27 }}>Create your VietCamp account</h1>
        <p className="lead" style={{ marginTop: 8 }}>Book campsites as a camper, or list and manage your own campsites as an owner.</p>
        <div className="col" style={{ gap: 14, marginTop: 20 }}>
          <div className="fld"><span className="lbl">I am registering as *</span>
            <div className="row" style={{ gap: 10 }}>
              <button className={r.role === 'Camper' ? 'btn p' : 'btn'} style={{ flex: 1 }} onClick={() => setR({ ...r, role: 'Camper' })}>Camper</button>
              <button className={r.role === 'Owner' ? 'btn p' : 'btn'} style={{ flex: 1 }} onClick={() => setR({ ...r, role: 'Owner' })}>Campsite owner</button>
            </div>
          </div>
          <div className="row" style={{ gap: 14 }}>
            <div className="fld" style={{ flex: 1 }}><span className="lbl">Full name *</span><input className="inp" type="text" placeholder="Nguyen Minh Anh" value={r.name} onChange={set('name')} /></div>
            <div className="fld" style={{ flex: 1 }}><span className="lbl">Phone number *</span><input className="inp" type="tel" placeholder="09xx xxx xxx" value={r.phone} onChange={set('phone')} /></div>
          </div>
          <div className="fld"><span className="lbl">Email address *</span><input className="inp" type="email" placeholder="you@example.com" value={r.email} onChange={set('email')} /></div>
          <div className="row" style={{ gap: 14 }}>
            <div className="fld" style={{ flex: 1 }}><span className="lbl">Password *</span>
              <div className="row" style={{ gap: 8 }}>
                <input className="inp" type={pwType} value={r.pw} onChange={set('pw')} style={{ flex: 1 }} />
                <button className="btn s" onClick={() => setR({ ...r, show: !r.show })}>{r.show ? 'Hide' : 'Show'}</button>
              </div>
              <span className="mut">At least 8 characters</span>
            </div>
            <div className="fld" style={{ flex: 1 }}><span className="lbl">Confirm password *</span><input className="inp" type={pwType} value={r.pw2} onChange={set('pw2')} /></div>
          </div>
          {r.role === 'Owner' && (
            <div className="fld"><span className="lbl">Business or campsite name *</span>
              <input className="inp" type="text" placeholder="Pine Hill Camping" value={r.biz} onChange={set('biz')} />
              <span className="mut">After signing up you can list campsites and submit verification documents.</span>
            </div>
          )}
          <label className="chk"><input type="checkbox" checked={r.terms} onChange={(e) => setR({ ...r, terms: e.target.checked })} /><span>I agree to the VietCamp terms of use and privacy policy *</span></label>
          <button className="btn p w" onClick={notConnected}>Create account</button>
          <p className="mut" style={{ textAlign: 'center' }}>Already registered? <button className="btn g s" onClick={() => navigate('/login')}>Log in</button></p>
        </div>
      </div>
    </div>
  )
}
