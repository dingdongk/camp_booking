import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeedback } from '../../components/ui/Feedback'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  const [email, setEmail] = useState('')

  return (
    <div className="wrap" style={{ maxWidth: 520 }}>
      <div className="card pad24" style={{ marginTop: 18 }}>
        <button className="bk" onClick={() => navigate('/login')}>← Back to login</button>
        <h1 style={{ fontSize: 27, marginTop: 8 }}>Reset your password</h1>
        <p className="lead" style={{ marginTop: 8 }}>Enter the email on your account and we will send a reset link.</p>
        <div className="col" style={{ gap: 14, marginTop: 20 }}>
          <div className="fld"><span className="lbl">Email address *</span>
            <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn p w" onClick={notConnected}>Send reset link</button>
        </div>
      </div>
    </div>
  )
}
