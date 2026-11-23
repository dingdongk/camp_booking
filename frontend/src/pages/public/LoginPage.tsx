import { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { getDemoCredentials } from '../../api/auth'
import { useFeedback } from '../../components/ui/Feedback'
import type { DemoCredential } from '../../types/models'

export async function loader() {
  return { creds: await getDemoCredentials() }
}

const HOME: Record<DemoCredential['role'], string> = { camper: '/me', owner: '/owner', admin: '/admin' }

// Static UI: "Log in" is not wired to Supabase yet; "Sign in now" only opens the role's dashboard.
export default function LoginPage() {
  const { creds } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const [role, setRole] = useState<DemoCredential['role'] | null>(null)
  const [form, setForm] = useState({ email: '', pw: '', remember: true, show: false })
  const picked = creds.find((c) => c.role === role)

  return (
    <div className="wrap" style={{ maxWidth: 980 }}>
      <div className="body" style={{ gap: 28, alignItems: 'stretch', marginTop: 18 }}>
        <div className="main" style={{ flex: '1 1 380px' }}>
          <div className="card pad24">
            <div className="crumb"><button onClick={() => navigate('/')}>Home</button><span className="sep">/</span><b>Log in</b></div>
            <h1 style={{ fontSize: 27 }}>{picked ? `${picked.name} login` : 'Log in to VietCamp'}</h1>
            <p className="lead" style={{ marginTop: 8 }}>{picked ? picked.note : 'Three account types, three different workspaces. Choose yours to continue.'}</p>
            <div className="grid g3" style={{ gap: 10, marginTop: 18 }}>
              {creds.map((c) => (
                <button key={c.role} className={role === c.role ? 'rolecard on' : 'rolecard'} onClick={() => { setRole(c.role); setForm({ ...form, email: '', pw: '' }) }}>
                  <span className="ic2" style={{ background: c.bg, color: c.fg }}>{c.ab}</span>
                  <b style={{ fontSize: 14.5 }}>{c.name}</b>
                  <span className="mut">{c.note}</span>
                </button>
              ))}
            </div>
            <div className="hr"></div>
            <div className="row" style={{ gap: 9 }}>
              <span className={picked ? 'bg ok' : 'bg wa'}>{picked ? `Signing in as ${picked.name}` : 'No account type selected'}</span>
              <span className="mut">{picked ? `You will land on the ${picked.dash.toLowerCase()}.` : 'Pick a card above first.'}</span>
            </div>
            <div className="col" style={{ gap: 14, marginTop: 16 }}>
              <div className="fld"><span className="lbl">Email address *</span>
                <input className="inp" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="fld"><span className="lbl">Password *</span>
                <div className="row" style={{ gap: 8 }}>
                  <input className="inp" type={form.show ? 'text' : 'password'} placeholder="Your password" value={form.pw} onChange={(e) => setForm({ ...form, pw: e.target.value })} style={{ flex: 1 }} />
                  <button className="btn s" onClick={() => setForm({ ...form, show: !form.show })}>{form.show ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="row">
                <label className="chk" style={{ border: 0, background: 'none', padding: 0 }}>
                  <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /><span>Keep me signed in</span>
                </label>
                <button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={() => navigate('/forgot-password')}>Forgot password?</button>
              </div>
              <button className="btn p w" onClick={notConnected}>Log in</button>
              <p className="mut" style={{ textAlign: 'center' }}>New to VietCamp? <button className="btn g s" onClick={() => navigate('/register')}>Create an account</button></p>
            </div>
          </div>
        </div>
        <aside style={{ flex: '0 0 320px' }}>
          <div className="card pad24" style={{ height: '100%', background: 'var(--forest)', borderColor: 'var(--forest)', color: '#EAF3EE' }}>
            <h3 style={{ color: '#fff' }}>Demo credentials</h3>
            <p style={{ marginTop: 8, color: '#C9DDD3' }}>Frontend demonstration only — no real authentication. Pick a role, then fill the form or use one-click sign-in.</p>
            <div className="col" style={{ gap: 12, marginTop: 16 }}>
              {creds.map((c) => (
                <div key={c.role}>
                  <div className="row" style={{ gap: 8 }}><b style={{ fontSize: 13.5, color: '#fff' }}>{c.name}</b><span className="mut" style={{ color: '#9FB6AA', marginLeft: 'auto' }}>{c.dash}</span></div>
                  <div className="cred" style={{ marginTop: 6, background: '#17402F', borderColor: '#2E5445', color: '#D9E7DF' }}>
                    <span>{c.email}</span><span>{c.pw}</span>
                  </div>
                  <div className="row" style={{ gap: 8, marginTop: 7 }}>
                    <button className="btn s" onClick={() => { setRole(c.role); setForm({ ...form, email: c.email, pw: c.pw }) }}>Fill the form</button>
                    <button className="btn a s" onClick={() => navigate(HOME[c.role])}>Sign in now</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hr" style={{ background: '#2E5445' }}></div>
            <p className="mut" style={{ color: '#9FB6AA' }}>Wrong credentials show an error. Each role lands on its own dashboard with its own navigation.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
