import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { db, auth } from "./firebase";

import "./App.css";


/* =========================================================
   DEMO ITEMS
   These remain visible until you start adding real reports.
========================================================= */

const demoLostItems = [
  {
    id: "demo-lost-1",
    type: "lost",
    name: "Black Headphones",
    category: "Electronics",
    location: "Central Library",
    date: "Today",
    emoji: "🎧",
  },
  {
    id: "demo-lost-2",
    type: "lost",
    name: "Student ID Card",
    category: "Documents",
    location: "Cafeteria",
    date: "Yesterday",
    emoji: "🪪",
  },
  {
    id: "demo-lost-3",
    type: "lost",
    name: "Blue Water Bottle",
    category: "Personal",
    location: "Block B",
    date: "2 days ago",
    emoji: "🧴",
  },
];

const demoFoundItems = [
  {
    id: "demo-found-1",
    type: "found",
    name: "Blue Backpack",
    category: "Bags",
    location: "Block B",
    date: "Today",
    emoji: "🎒",
  },
  {
    id: "demo-found-2",
    type: "found",
    name: "Key Chain",
    category: "Keys",
    location: "Cafeteria",
    date: "Yesterday",
    emoji: "🔑",
  },
  {
    id: "demo-found-3",
    type: "found",
    name: "Student ID Card",
    category: "Documents",
    location: "Library",
    date: "2 days ago",
    emoji: "🪪",
  },
];


/* =========================================================
   CATEGORY EMOJI
========================================================= */

function getEmoji(category) {
  const emojis = {
    Electronics: "🎧",
    Documents: "🪪",
    Bags: "🎒",
    Personal: "🧴",
    Keys: "🔑",
  };

  return emojis[category] || "📦";
}


/* =========================================================
   FIRESTORE HOOK
========================================================= */

function useFirestoreItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const itemsRef = collection(db, "items");

    const unsubscribe = onSnapshot(
      itemsRef,
      (snapshot) => {
        const firebaseItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        firebaseItems.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;

          return bTime - aTime;
        });

        setItems(firebaseItems);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Unable to load Firebase data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { items, loading, error };
}


/* =========================================================
   AUTH HOOK
========================================================= */

function useAuthUser() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, authLoading };
}


/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const { user, authLoading } = useAuthUser();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Campus<span>Find</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lost">Lost Items</Link>
        <Link to="/found">Found Items</Link>
      </div>

      {!authLoading && user ? (
        <button className="login-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login" className="login-btn">
          Login
        </Link>
      )}
    </nav>
  );
}


/* =========================================================
   HOME
========================================================= */

function Home() {
  const navigate = useNavigate();

  const { items } = useFirestoreItems();

  const firebaseLost = items.filter((item) => item.type === "lost");
  const firebaseFound = items.filter((item) => item.type === "found");

  const recentItems = [
    ...firebaseLost,
    ...firebaseFound,
    ...demoLostItems,
    ...demoFoundItems,
  ].slice(0, 3);

  return (
    <>
      <Navbar />

      <main>

        <section className="hero">

          <div className="hero-tag">
            🎓 CAMPUS COMMUNITY
          </div>

          <h1>
            Lost something?
            <br />
            <span>Let's find it.</span>
          </h1>

          <p>
            A simple campus platform to report lost items, share found items,
            and reconnect people with their belongings.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/report-lost")}
            >
              🔍 I Lost Something
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/report-found")}
            >
              📦 I Found Something
            </button>

          </div>

        </section>


        <section className="home-search">

          <div className="section-label">
            FIND AN ITEM
          </div>

          <h2>Search the campus.</h2>

          <p>
            Find lost and found items quickly.
          </p>

          <button
            className="black-btn"
            onClick={() => navigate("/lost")}
          >
            Search Items →
          </button>

        </section>


        <section className="home-items">

          <div className="section-label">
            RECENTLY REPORTED
          </div>

          <h2>Lost & Found</h2>

          <div className="item-grid">

            {recentItems.map((item) => (
              <ItemCard
                key={`${item.type || "demo"}-${item.id}`}
                item={item}
                type={item.type || "lost"}
              />
            ))}

          </div>

        </section>


        <section className="how-section">

          <div className="section-label">
            HOW IT WORKS
          </div>

          <h2>Lost. Found. Reconnected.</h2>

          <div className="steps">

            <div className="step">
              <span>01</span>

              <h3>Report</h3>

              <p>
                Tell the campus community what you lost or found.
              </p>
            </div>


            <div className="step">
              <span>02</span>

              <h3>Search</h3>

              <p>
                Search items using location, category or keywords.
              </p>
            </div>


            <div className="step">
              <span>03</span>

              <h3>Reconnect</h3>

              <p>
                Contact the person and get the item back.
              </p>
            </div>

          </div>

        </section>

      </main>
    </>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const { items, loading, error } = useFirestoreItems();
  const allItems = [...items, ...demoLostItems, ...demoFoundItems];
  const lostCount = allItems.filter((item) => item.type === "lost").length;
  const foundCount = allItems.filter((item) => item.type === "found").length;
  const recentItems = [...allItems]
    .sort(
      (a, b) =>
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    )
    .slice(0, 5);

  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <div className="section-label">CAMPUS OVERVIEW</div>
            <h1>Your dashboard</h1>
            <p>See what has been reported and help campus items find their way home.</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/report-lost" className="dashboard-action">
              + Report lost
            </Link>
            <Link to="/report-found" className="dashboard-action secondary">
              + Report found
            </Link>
          </div>
        </header>

        {error && <p className="firebase-status">{error} Showing available sample reports.</p>}

        <section className="dashboard-stats" aria-label="Item report totals">
          <Link to="/lost" className="dashboard-stat">
            <span className="dashboard-stat-icon">🔎</span>
            <span className="dashboard-stat-label">Lost items</span>
            <strong>{lostCount}</strong>
            <span className="dashboard-stat-link">Browse lost items →</span>
          </Link>

          <Link to="/found" className="dashboard-stat">
            <span className="dashboard-stat-icon">📦</span>
            <span className="dashboard-stat-label">Found items</span>
            <strong>{foundCount}</strong>
            <span className="dashboard-stat-link">Browse found items →</span>
          </Link>

          <div className="dashboard-stat total">
            <span className="dashboard-stat-icon">📋</span>
            <span className="dashboard-stat-label">Total reports</span>
            <strong>{allItems.length}</strong>
            <span className="dashboard-stat-link">Across the campus</span>
          </div>
        </section>

        <section className="dashboard-recent">
          <div className="dashboard-section-heading">
            <div>
              <div className="section-label">LATEST ACTIVITY</div>
              <h2>Recent reports</h2>
            </div>
            <Link to="/lost">Browse all items →</Link>
          </div>

          {loading && <p className="firebase-status">Loading live reports...</p>}

          <div className="dashboard-report-list">
            {recentItems.map((item) => (
              <Link
                to={`/item/${item.id}?type=${item.type}`}
                className="dashboard-report"
                key={`${item.type}-${item.id}`}
              >
                <span className="dashboard-report-icon">
                  {item.emoji || getEmoji(item.category)}
                </span>
                <span className="dashboard-report-details">
                  <strong>{item.name}</strong>
                  <small>{item.category} · {item.location}</small>
                </span>
                <span className={`dashboard-report-status ${item.type}`}>
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
                <span className="dashboard-report-date">
                  {item.date ||
                    (item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" }
                        )
                      : "Recent")}
                </span>
                <span className="dashboard-report-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}


/* =========================================================
   ITEM CARD
========================================================= */

function ItemCard({ item, type }) {

  const navigate = useNavigate();

  return (
    <div
      className="item-card"
      onClick={() =>
        navigate(`/item/${item.id}?type=${type}`)
      }
    >

      <div className="item-emoji">
        {item.emoji || getEmoji(item.category)}
      </div>

      <h3>{item.name}</h3>

      <p>
        📍 {item.location}
      </p>

      <div className="item-bottom">

        <span>
          {item.category}
        </span>

        <small>
          {type === "lost" ? "Lost" : "Found"}
          {" • "}
          {item.date}
        </small>

      </div>

    </div>
  );
}


/* =========================================================
   LOST ITEMS
========================================================= */

function LostItems() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { items, loading, error } = useFirestoreItems();

  const firebaseLostItems = items.filter(
    (item) => item.type === "lost"
  );

  const allLostItems = [
    ...firebaseLostItems,
    ...demoLostItems,
  ];

  const filteredItems = allLostItems.filter((item) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });


  return (
    <>
      <Navbar />

      <main className="page">

        <div className="page-header">

          <div className="section-label">
            LOST ITEMS
          </div>

          <h1>
            Find what you've lost.
          </h1>

          <p>
            Browse items reported missing around the campus.
          </p>

        </div>


        <div className="filter-box">

          <input
            type="text"
            placeholder="🔍 Search item or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />


          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="All">
              All Categories
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Documents">
              Documents
            </option>

            <option value="Personal">
              Personal
            </option>

            <option value="Bags">
              Bags
            </option>

            <option value="Keys">
              Keys
            </option>

          </select>


          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear
          </button>

        </div>


        {loading && (
          <p className="firebase-status">
            Loading reports...
          </p>
        )}

        {error && (
          <p className="firebase-status">
            {error}
          </p>
        )}


        <div className="item-grid large">

          {filteredItems.length > 0 ? (

            filteredItems.map((item) => (

              <ItemCard
                key={item.id}
                item={item}
                type="lost"
              />

            ))

          ) : (

            <div className="empty">

              <div>🔎</div>

              <h2>
                No lost items found
              </h2>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </div>


        <div className="bottom-action">

          <Link
            to="/report-lost"
            className="black-btn"
          >
            + Report Lost Item
          </Link>

        </div>

      </main>
    </>
  );
}


/* =========================================================
   FOUND ITEMS
========================================================= */

function FoundItems() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { items, loading, error } = useFirestoreItems();

  const firebaseFoundItems = items.filter(
    (item) => item.type === "found"
  );

  const allFoundItems = [
    ...firebaseFoundItems,
    ...demoFoundItems,
  ];

  const filteredItems = allFoundItems.filter((item) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });


  return (
    <>
      <Navbar />

      <main className="page">

        <div className="page-header">

          <div className="section-label">
            FOUND ITEMS
          </div>

          <h1>
            Maybe it's yours.
          </h1>

          <p>
            Browse items found around the campus.
          </p>

        </div>


        <div className="filter-box">

          <input
            type="text"
            placeholder="🔍 Search item or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />


          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="All">
              All Categories
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Documents">
              Documents
            </option>

            <option value="Personal">
              Personal
            </option>

            <option value="Bags">
              Bags
            </option>

            <option value="Keys">
              Keys
            </option>

          </select>


          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear
          </button>

        </div>


        {loading && (
          <p className="firebase-status">
            Loading reports...
          </p>
        )}

        {error && (
          <p className="firebase-status">
            {error}
          </p>
        )}


        <div className="item-grid large">

          {filteredItems.length > 0 ? (

            filteredItems.map((item) => (

              <ItemCard
                key={item.id}
                item={item}
                type="found"
              />

            ))

          ) : (

            <div className="empty">

              <div>🔎</div>

              <h2>
                No found items found
              </h2>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </div>


        <div className="bottom-action">

          <Link
            to="/report-found"
            className="black-btn"
          >
            + Report Found Item
          </Link>

        </div>

      </main>
    </>
  );
}


/* =========================================================
   REPORT LOST
========================================================= */

function ReportLost() {

  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, authLoading } = useAuthUser();


  async function handleSubmit(e) {

    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");


    const form = new FormData(e.target);

    const itemName = form.get("itemName");
    const category = form.get("category");
    const description = form.get("description");
    const location = form.get("location");
    const date = form.get("date");
    const contact = form.get("contact");


    try {

      await addDoc(collection(db, "items"), {

        type: "lost",

        userId: user.uid,
        userEmail: user.email,

        name: itemName,

        category: category,

        description: description,

        location: location,

        date: date,

        contact: contact,

        emoji: getEmoji(category),

        createdAt: serverTimestamp(),

      });


      setSubmitted(true);

    } catch (err) {

      console.error(err);

      setError(
        "Could not save your report. Please try again."
      );

    } finally {

      setLoading(false);

    }
  }


  if (submitted) {

    return (
      <>
        <Navbar />

        <div className="success-page">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Lost item reported.
          </h1>

          <p>
            Your report has been successfully saved to CampusFind.
          </p>

          <Link
            to="/lost"
            className="black-btn"
          >
            View Lost Items
          </Link>

        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="form-page">

        <div className="form-header">

          <div className="section-label">
            REPORT ITEM
          </div>

          <h1>
            Report a lost item.
          </h1>

          <p>
            Help the campus community find your belongings.
          </p>

        </div>


        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          <label>
            Item Name
          </label>

          <input
            required
            name="itemName"
            type="text"
            placeholder="Example: Black Wallet"
          />


          <label>
            Category
          </label>

          <select
            required
            name="category"
          >

            <option value="">
              Select category
            </option>

            <option>
              Electronics
            </option>

            <option>
              Documents
            </option>

            <option>
              Bags
            </option>

            <option>
              Personal
            </option>

            <option>
              Keys
            </option>

          </select>


          <label>
            Description
          </label>

          <textarea
            required
            name="description"
            placeholder="Describe the item..."
          ></textarea>


          <label>
            Last Seen Location
          </label>

          <input
            required
            name="location"
            type="text"
            placeholder="Example: Library - 2nd Floor"
          />


          <label>
            Date Lost
          </label>

          <input
            required
            name="date"
            type="date"
          />


          <label>
            Contact Information
          </label>

          <input
            required
            name="contact"
            type="text"
            placeholder="Phone number or email"
          />


          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "🚀 Report Lost Item"}
          </button>

        </form>

      </main>
    </>
  );
}


/* =========================================================
   REPORT FOUND
========================================================= */

function ReportFound() {
  const navigate = useNavigate();

  const { user } = useAuthUser();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSubmit(e) {

    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");


    const form = new FormData(e.target);

    const itemName = form.get("itemName");
    const category = form.get("category");
    const description = form.get("description");
    const location = form.get("location");
    const date = form.get("date");
    const contact = form.get("contact");


    try {

      await addDoc(collection(db, "items"), {

        type: "found",

        userId: user.uid,
        userEmail: user.email,

        name: itemName,

        category: category,

        description: description,

        location: location,

        date: date,

        contact: contact,

        emoji: getEmoji(category),

        createdAt: serverTimestamp(),

      });


      setSubmitted(true);

    } catch (err) {

      console.error(err);

      setError(
        "Could not save your report. Please try again."
      );

    } finally {

      setLoading(false);

    }
  }


  if (submitted) {

    return (
      <>
        <Navbar />

        <div className="success-page">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Found item reported.
          </h1>

          <p>
            Your report has been successfully saved to CampusFind.
          </p>

          <Link
            to="/found"
            className="black-btn"
          >
            View Found Items
          </Link>

        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="form-page">

        <div className="form-header">

          <div className="section-label">
            REPORT ITEM
          </div>

          <h1>
            Report a found item.
          </h1>

          <p>
            Help return someone's belongings.
          </p>

        </div>


        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          <label>
            Item Name
          </label>

          <input
            required
            name="itemName"
            type="text"
            placeholder="Example: Blue Backpack"
          />


          <label>
            Category
          </label>

          <select
            required
            name="category"
          >

            <option value="">
              Select category
            </option>

            <option>
              Electronics
            </option>

            <option>
              Documents
            </option>

            <option>
              Bags
            </option>

            <option>
              Personal
            </option>

            <option>
              Keys
            </option>

          </select>


          <label>
            Description
          </label>

          <textarea
            required
            name="description"
            placeholder="Describe the item..."
          ></textarea>


          <label>
            Found Location
          </label>

          <input
            required
            name="location"
            type="text"
            placeholder="Example: Block B"
          />


          <label>
            Date Found
          </label>

          <input
            required
            name="date"
            type="date"
          />


          <label>
            Contact Information
          </label>

          <input
            required
            name="contact"
            type="text"
            placeholder="Phone number or email"
          />


          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "📦 Report Found Item"}
          </button>

        </form>

      </main>
    </>
  );
}


/* =========================================================
   ITEM DETAILS
========================================================= */

function ItemDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useAuthUser();
  const { items, loading, error } = useFirestoreItems();

  const typeFromUrl = searchParams.get("type");

  const allItems = [
    ...items,
    ...demoLostItems,
    ...demoFoundItems,
  ];

  const item = allItems.find((currentItem) => currentItem.id === id);

  const itemType = item?.type || typeFromUrl || "lost";

  const [showContact, setShowContact] = useState(false);

  if (loading && !item) {
    return (
      <>
        <Navbar />
        <main className="page">
          <div className="page-header">
            <div className="section-label">ITEM DETAILS</div>
            <h1>Loading item...</h1>
            <p>Please wait while we load the report.</p>
          </div>
        </main>
      </>
    );
  }

  if (error && !item) {
    return (
      <>
        <Navbar />
        <main className="page">
          <div className="page-header">
            <div className="section-label">ITEM DETAILS</div>
            <h1>Unable to load item.</h1>
            <p>{error}</p>
            <button
              className="black-btn"
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="page">
          <div className="page-header">
            <div className="section-label">ITEM DETAILS</div>
            <h1>Item not found.</h1>
            <p>This report may have been removed or is no longer available.</p>

            <button
              className="black-btn"
              onClick={() =>
                navigate(itemType === "found" ? "/found" : "/lost")
              }
            >
              ← Back to Items
            </button>
          </div>
        </main>
      </>
    );
  }

  const isLost = itemType === "lost";

  function handleContact() {
    if (!user) {
      navigate("/login");
      return;
    }

    setShowContact(true);
  }

  return (
    <>
      <Navbar />

      <main className="details-page">

        <button
          className="back-link"
          onClick={() =>
            navigate(isLost ? "/lost" : "/found")
          }
        >
          ← Back to {isLost ? "Lost Items" : "Found Items"}
        </button>

        <div className="details-card">

          <div className="details-icon">
            {item.emoji || getEmoji(item.category)}
          </div>

          <div className="details-type">
            {isLost ? "LOST ITEM" : "FOUND ITEM"}
          </div>

          <h1>{item.name}</h1>

          <p className="details-category">
            {item.category}
          </p>

          <div className="details-info">

            <div className="details-info-row">
              <span>📍 Location</span>
              <strong>{item.location}</strong>
            </div>

            <div className="details-info-row">
              <span>📅 Date</span>
              <strong>{item.date || "Not provided"}</strong>
            </div>

            <div className="details-info-row">
              <span>📝 Description</span>
              <strong>{item.description || "No description provided."}</strong>
            </div>

          </div>

          <div className="details-action">

            {!showContact ? (
              <>
                <button
                  className="black-btn"
                  onClick={handleContact}
                >
                  {isLost
                    ? "🔎 I Found This Item"
                    : "🎒 This Is My Item"}
                </button>

                <p className="details-note">
                  {user
                    ? "Tap the button to view the reporter's contact information."
                    : "Login is required before viewing the reporter's contact information."}
                </p>
              </>
            ) : (
              <div className="contact-box">
                <div className="section-label">
                  CONTACT REPORTER
                </div>

                <h2>{item.contact || "Contact information not provided."}</h2>

                <p>
                  Please verify the item details before handing over or
                  collecting any belongings.
                </p>
              </div>
            )}

          </div>

        </div>

      </main>
    </>
  );
}


/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/");
    } catch (err) {
      console.error("Authentication error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-card">
          <div className="section-label">
            {mode === "login" ? "WELCOME BACK" : "JOIN CAMPUSFIND"}
          </div>

          <h1>
            {mode === "login" ? "CampusFind." : "Create account."}
          </h1>

          <p>
            {mode === "login"
              ? "Login to manage your lost and found reports."
              : "Create your CampusFind account to report and manage items."}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              required
              type="email"
              placeholder="College email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {mode === "signup" && (
              <input
                required
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            {error && <p className="form-error">{error}</p>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login"
                  : "Create Account"}
            </button>
          </form>

          <small>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="auth-switch"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </small>
        </div>
      </div>
    </>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/lost"
          element={<LostItems />}
        />

        <Route
          path="/found"
          element={<FoundItems />}
        />

        <Route
          path="/item/:id"
          element={<ItemDetails />}
        />

        <Route
          path="/report-lost"
          element={<ReportLost />}
        />

        <Route
          path="/report-found"
          element={<ReportFound />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;