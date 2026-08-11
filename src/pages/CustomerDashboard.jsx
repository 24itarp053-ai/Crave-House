import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiUser, FiMapPin, FiMail, FiPhone, FiBookOpen, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../pizza-page.css';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="pizza-page">
      {/* Header */}
      <header className="pizza-nav">
        <Link to="/" className="pizza-brand">
          <span>CH</span>
          <i>Crave House</i>
        </Link>

        <Link to="/order" className="pizza-back">
          <FiArrowLeft /> Back to Menu
        </Link>

        <Link to="/cart" className="pizza-cart" aria-label="Shopping cart">
          <FiShoppingBag /> Cart <b>{cartCount}</b>
        </Link>
      </header>

      {/* Hero Banner */}
      <section className="pizza-hero" style={{ background: '#26150f' }}>
        <p className="eyebrow">CUSTOMER PORTAL</p>
        <h1>
          Welcome,
          <br />
          <em>{user?.name || 'Customer'}.</em>
        </h1>
        <p>Manage your profile, check orders, view reservations, or start a new order.</p>
      </section>

      {/* Dashboard Content Container */}
      <div className="product-details-container" style={{ padding: '60px max(6vw, 24px) 80px' }}>
        <div className="dashboard-layout">
          {/* Left Panel: Profile Info */}
          <div className="dashboard-profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FiUser />
              </div>
              <h3>{user?.name}</h3>
              <span className="profile-badge">Customer Member</span>
            </div>
            
            <div className="profile-details-list">
              <div className="profile-detail-item">
                <FiMail className="detail-icon" />
                <div>
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <FiPhone className="detail-icon" />
                <div>
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">+91 98765 43210</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <FiMapPin className="detail-icon" />
                <div>
                  <span className="detail-label">Default Address</span>
                  <span className="detail-value">123 Green Valley Street, New Delhi</span>
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="dashboard-logout-btn">
              <FiLogOut /> Log Out
            </button>
          </div>

          {/* Right Panel: Actions & Blocks */}
          <div className="dashboard-actions-panel">
            <h2>Quick Actions</h2>
            <div className="dashboard-grid-cards">
              {/* Browse Menu */}
              <Link to="/order" className="dashboard-action-card">
                <div className="action-card-icon">
                  <FiBookOpen />
                </div>
                <h4>Browse Menu</h4>
                <p>Explore our fresh pizza, burgers, pastas, salads, and more.</p>
                <span className="action-card-link">Go to Menu &rarr;</span>
              </Link>

              {/* My Cart */}
              <Link to="/cart" className="dashboard-action-card">
                <div className="action-card-icon">
                  <FiShoppingBag />
                </div>
                <h4>My Cart</h4>
                <p>View items currently in your cart and proceed to checkout.</p>
                <span className="action-card-link">View Cart &rarr;</span>
              </Link>

              {/* My Orders */}
              <Link to="/orders" className="dashboard-action-card">
                <div className="action-card-icon">
                  <FiShoppingBag />
                </div>
                <h4>My Orders</h4>
                <p>Track current orders or review your ordering history.</p>
                <span className="action-card-link">View Orders &rarr;</span>
              </Link>

              {/* My Reservations */}
              <div className="dashboard-action-card disabled">
                <span className="phase-2-badge">Next Phase</span>
                <div className="action-card-icon">
                  <FiCalendar />
                </div>
                <h4>My Reservations</h4>
                <p>Check active table reservations and review status.</p>
                <span className="action-card-note">Coming in the next development phase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
