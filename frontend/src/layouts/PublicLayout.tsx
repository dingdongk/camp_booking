import { Outlet, useNavigate } from 'react-router-dom'
import { Brand, NavButton } from './NavButton'

export default function PublicLayout() {
  const navigate = useNavigate()
  return (
    <>
      <header className="hdr">
        <Brand />
        <nav className="nav">
          <NavButton to="/">Home</NavButton>
          <NavButton to="/search">Find campsites</NavButton>
          <NavButton to="/map">Map</NavButton>
          <NavButton to="/chat">AI assistant</NavButton>
        </nav>
        <div className="right">
          <button className="btn s" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn p s" onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </header>
      <div className="body">
        <div className="main">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="cols">
        <div>
          <div className="brand" style={{ marginBottom: 12 }}><span className="mk">VC</span><span className="nm" style={{ color: '#fff' }}>VietCamp</span></div>
          <p>Vietnam's campsite directory and booking platform. Discover verified campsites, check real availability and send a booking request straight to the owner.</p>
        </div>
        <div><h4>Discover</h4><ul>
          <li><a href="#top">Featured campsites</a></li>
          <li><a href="#top">Popular destinations</a></li>
          <li><a href="#top">Interactive map</a></li>
          <li><a href="#top">AI assistant</a></li>
        </ul></div>
        <div><h4>Campsite owners</h4><ul>
          <li><a href="#top">List your campsite</a></li>
          <li><a href="#top">Verification process</a></li>
          <li><a href="#top">Availability &amp; capacity</a></li>
          <li><a href="#top">Owner guidelines</a></li>
        </ul></div>
        <div><h4>Support</h4><ul>
          <li><a href="#top">Help centre</a></li>
          <li><a href="#top">Camping safety</a></li>
          <li><a href="#top">Report a listing</a></li>
          <li><a href="#top">Terms &amp; privacy</a></li>
        </ul></div>
      </div>
      <div className="bot">
        <span>© 2026 VietCamp — university project prototype</span>
        <span className="mla" style={{ marginLeft: 'auto' }}>Da Lat · Vung Tau · Ninh Binh · Ha Giang · Lam Dong · Binh Thuan</span>
      </div>
    </footer>
  )
}
