import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiGrid, FiList, FiUsers, FiCalendar, FiBarChart2, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../pizza-page.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sections = [
    { title: 'Overview Dashboard', icon: <FiGrid />, desc: 'Review key hotel metrics, quick tasks, and notifications.' },
    { title: 'Orders Panel', icon: <FiShoppingBag />, desc: 'Monitor, update status, and manage customer food delivery orders.' },
    { title: 'Menu Management', icon: <FiList />, desc: 'Edit prices, toggle availability, and add/remove dishes.' },
    { title: 'Customers Directory', icon: <FiUsers />, desc: 'View customer accounts, contact details, and logs.' },
    { title: 'Reservations Manager', icon: <FiCalendar />, desc: 'Confirm table allocations, view scheduling, and cancellations.' },
    { title: 'Analytics & Reports', icon: <FiBarChart2 />, desc: 'Sales logs, popular dishes, average order value, and times.' }
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
        <p className="eyebrow">ADMINISTRATIVE PANEL</p>
        <h1>
          Admin Control
          <br />
          <em>Dashboard.</em>
        </h1>
        <p>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
      </section>

      {/* Content */}
      <div className="product-details-container" style={{ padding: '60px max(6vw, 24px) 80px' }}>
        <div className="admin-dashboard-container">
          <div className="admin-header-row">
            <h2>Management Console</h2>
            <button onClick={handleLogout} className="dashboard-logout-btn admin-logout-btn">
              <FiLogOut /> Log Out Staff
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
