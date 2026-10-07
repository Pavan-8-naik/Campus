import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div className="site">

      <Navbar />

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-left">

          <div className="hero-tag">
            <span>✦</span>
            CAMPUS COMMUNITY
          </div>

          <h1>
            Your campus.
            <br />
            <span>Your belongings.</span>
          </h1>

          <p className="hero-description">
            Lost something? Found something?
            CampusFind helps students reconnect
            with their belongings — faster.
          </p>

          <div className="hero-search">
            <span>⌕</span>

            <input
              placeholder="Search lost or found items..."
            />

            <button>Search</button>
          </div>

          <div className="hero-actions">

            <Link
              to="/report-lost"
              className="main-action"
            >
              🔍 Report Lost Item
              <span>→</span>
            </Link>

            <Link
              to="/report-found"
              className="second-action"
            >
              📦 Report Found Item
              <span>→</span>
            </Link>

          </div>

        </div>

        <div className="hero-right">

          <div className="hero-card main-card">

            <div className="card-top">
              <span>RECENTLY REPORTED</span>
              <span className="live-dot">● LIVE</span>
            </div>

            <div className="big-item-icon">
              🎧
            </div>

            <h3>Black Headphones</h3>

            <p>📍 Central Library</p>

            <div className="card-bottom">
              <span className="lost-badge">LOST</span>
              <span>Today</span>
            </div>

          </div>

          <div className="floating-card floating-one">
            🎒
            <div>
              <strong>Blue Backpack</strong>
              <small>Found • Block B</small>
            </div>
          </div>

          <div className="floating-card floating-two">
            🪪
            <div>
              <strong>Student ID</strong>
              <small>Lost • Cafeteria</small>
            </div>
          </div>

        </div>

      </section>


      {/* QUICK DISCOVERY */}

      <section className="discover-section">

        <div className="section-heading">

          <div>
            <p className="section-label">
              DISCOVER
            </p>

            <h2>
              Find it fast.
            </h2>
          </div>

          <Link to="/lost">
            View all lost items →
          </Link>

        </div>


        <div className="item-grid">

          <div className="item-preview">

            <div className="preview-image">
              🎧
            </div>

            <div className="preview-info">
              <span className="status lost">
                LOST
              </span>

              <h3>Black Headphones</h3>

              <p>📍 Library</p>
            </div>

          </div>


          <div className="item-preview">

            <div className="preview-image">
              🎒
            </div>

            <div className="preview-info">
              <span className="status found">
                FOUND
              </span>

              <h3>Blue Backpack</h3>

              <p>📍 Block B</p>
            </div>

          </div>


          <div className="item-preview">

            <div className="preview-image">
              🪪
            </div>

            <div className="preview-info">
              <span className="status lost">
                LOST
              </span>

              <h3>Student ID Card</h3>

              <p>📍 Cafeteria</p>
            </div>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="how-section">

        <p className="section-label">
          HOW IT WORKS
        </p>

        <h2>
          Lost. Found. Reconnected.
        </h2>

        <div className="steps">

          <div className="step">
            <span>01</span>
            <h3>Report</h3>
            <p>
              Tell the campus community
              what you lost or found.
            </p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Search</h3>
            <p>
              Search items using location,
              category or keywords.
            </p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Reconnect</h3>
            <p>
              Contact the person and
              return the belonging.
            </p>
          </div>

        </div>

      </section>

    </div>
  )
}

export default Home