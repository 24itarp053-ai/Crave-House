import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiGrid, FiShoppingBag, FiList, FiTrendingUp, FiCalendar, FiLogOut, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../pizza-page.css';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sections = [
    { title: 'Restaurant Overview', icon: <FiGrid />, desc: 'Real-time kitchen statistics, status notifications, and live alerts.' },
    { title: 'Orders Fulfillment', icon: <FiShoppingBag />, desc: 'Review, accept, print receipts, and assign deliveries.' },
    { title: 'Signature Menu', icon: <FiList />, desc: 'Toggle daily special items, edit details, and custom categories.' },
    { title: 'Dining Area Tables', icon: <FiGrid />, desc: 'Setup table structures, capacity rules, and view visual layouts.' },
    { title: 'Table Reservations', icon: <FiCalendar />, desc: 'Manage guest seating charts, arrivals, and VIP bookings.' },
    { title: 'Sales Performance', icon: <FiTrendingUp />, desc: 'Review revenue margins, payment breakdown, and total payouts.' }
  ];

  return (
    <main className="pizza-page">
      {/* Header */}
      <header className="pizza-nav">
        <Link to="/" className="pizza-brand">
          <span>CH</span>
          <i>Crave House</i>
        </Link>

        <Link to="/" className="pizza-back">
          <FiArrowLeft /> Back to home
        </Link>

        <Link to="/cart" className="pizza-cart" aria-label="Shopping cart">
          <FiShoppingBag /> Cart <b>{cartCount}</b>
        </Link>
      </header>

      {/* Hero Banner */}
      <section className="pizza-hero" style={{ background: '#26150f' }}>
        <p className="eyebrow">RESTAURANT OWNER SPACE</p>
        <h1>
          Owner Management
          <br />
          <em>Console.</em>
        </h1>
        <p>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
      </section>

      {/* Content */}
      <div className="product-details-container" style={{ padding: '60px max(6vw, 24px) 80px' }}>
        <div className="admin-dashboard-container">
          <div className="admin-header-row">
            <h2>Restaurant Dashboard</h2>
            <button onClick={handleLogout} className="dashboard-logout-btn owner-logout-btn">
              <FiLogOut /> Log Out Owner
            </button>
          </div>

          <div className="admin-grid">
            {sections.map((section, idx) => (
              <div key={idx} className="admin-card disabled">
                <span className="phase-2-badge">Next Phase</span>
                <div className="admin-card-icon">
                  {section.icon}
                </div>
                <h3>{section.title}</h3>
                <p>{section.desc}</p>
                <div className="admin-card-footer">
                  <span>Coming in the next development phase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
