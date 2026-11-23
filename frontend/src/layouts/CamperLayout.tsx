import { Outlet, useNavigate } from 'react-router-dom'
import { useFeedback } from '../components/ui/Feedback'
import { Brand, NavButton } from './NavButton'

export default function CamperLayout() {
  const navigate = useNavigate()
  const { notConnected } = useFeedback()
  return (
    <>
      <header className="hdr">
        <Brand />
        <nav className="nav">
          <NavButton to="/search">Find campsites</NavButton>
          <NavButton to="/map">Map</NavButton>
          <NavButton to="/chat">AI assistant</NavButton>
          <NavButton to="/me">Dashboard</NavButton>
          <NavButton to="/me/bookings" end={false}>My bookings</NavButton>
          <NavButton to="/me/favorites">Favorites</NavButton>
          <NavButton to="/me/reviews">My reviews</NavButton>
          <NavButton to="/me/reports">My reports</NavButton>
        </nav>
        <div className="right">
          <div className="who">
            <span className="av">MA</span>
            <span><b style={{ fontSize: 13.5 }}>Minh Anh</b><br /><span className="mut">Camper</span></span>
          </div>
          <button className="btn s" onClick={() => navigate('/me/profile')}>Profile</button>
          <button className="btn g s" onClick={notConnected}>Log out</button>
        </div>
      </header>
      <div className="body">
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  )
}
