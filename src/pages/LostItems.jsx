import { useState } from 'react'
import Navbar from '../components/Navbar'

function LostItems() {
  const [search, setSearch] = useState('')

  const lostItems = [
    {
      name: 'Black Headphones',
      location: 'Library',
      category: 'Electronics',
      date: 'Today',
      icon: '🎧'
    },
    {
      name: 'Black Wallet',
      location: 'Block A',
      category: 'Wallet',
      date: 'Yesterday',
      icon: '👛'
    },
    {
      name: 'Student ID Card',
      location: 'Cafeteria',
      category: 'Documents',
      date: '2 days ago',
      icon: '🪪'
    },
    {
      name: 'Blue Notebook',
      location: 'Classroom 204',
      category: 'Books',
      date: '3 days ago',
      icon: '📓'
    }
  ]

  const filteredItems = lostItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">

      <Navbar />

      <section className="items-page">

        <div className="items-header">

          <p className="small-title">
            🔍 CAMPUS LOST ITEMS
          </p>

          <h1>
            Lost Items
          </h1>

          <p>
            Find items reported lost around your campus.
          </p>

        </div>

        {/* SEARCH */}

        <div className="items-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search item, location or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* ITEMS */}

        <div className="items-count">
          {filteredItems.length} item
          {filteredItems.length !== 1 ? 's' : ''} found
        </div>

        <div className="lost-items-grid">

          {filteredItems.length > 0 ? (

            filteredItems.map((item, index) => (

              <div
                className="lost-item-card"
                key={index}
              >

                <div className="lost-item-icon">
                  {item.icon}
                </div>

                <h3>
                  {item.name}
                </h3>

                <p>
                  📍 {item.location}
                </p>

                <p>
                  🏷️ {item.category}
                </p>

                <div className="item-date">
                  Lost • {item.date}
                </div>

                <button
                  className="view-item-btn"
                  onClick={() =>
                    alert(`You selected ${item.name}`)
                  }
                >
                  View Item
                </button>

              </div>

            ))

          ) : (

            <div className="no-items">
              <div>🔎</div>

              <h2>
                No lost items found
              </h2>

              <p>
                Try searching with another keyword.
              </p>
            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default LostItems