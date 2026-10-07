import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Campus<span>Find</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Discover</Link>
        <Link to="/lost">Lost</Link>
        <Link to="/found">Found</Link>
      </div>

      <Link to="/login" className="login-btn">
        Login
      </Link>
    </nav>
  )
}

export default Navbar