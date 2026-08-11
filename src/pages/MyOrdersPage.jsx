import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiInfo, FiClock, FiTrash2, FiMapPin, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import '../pizza-page.css';

export default function MyOrdersPage() {
  const { cartCount } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = () => {
    try {
      const stored = localStorage.getItem('craveHouseLastOrder');
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        setOrder(null);
      }
    } catch (e) {
      console.error('Error loading craveHouseLastOrder:', e);
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('craveHouseLastOrder');
      setOrder(null);
    } catch (e) {
      console.error('Error clearing order history:', e);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <p className="eyebrow">ORDER HISTORY</p>
        <h1>
          Your Recent
          <br />
          <em>Orders.</em>
        </h1>
        <p>View your temporary simulated checkout order, active preparation status, and items.</p>
      </section>

      {/* Orders Container */}
      <div className="product-details-container" style={{ padding: '60px max(6vw, 24px) 80px' }}>
        {!order ? (
          /* Empty Orders State */
          <div className="empty-cart-wrapper">
            <div className="empty-cart-icon">
              <FiPackage />
            </div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start exploring our categories and place your first order!</p>
            <Link to="/order" className="explore-menu-btn">
              Start Ordering &rarr;
            </Link>
          </div>
        ) : (
          /* Orders Present List */
          <div className="my-orders-layout-container">
            <div className="my-orders-header-row">
              <h2>Recent Orders</h2>
              <button onClick={handleClearHistory} className="clear-history-btn" title="Simulate clearing storage">
                <FiTrash2 /> Clear Order History
              </button>
            </div>

            <div className="order-history-card">
              {/* Card Title Header */}
              <div className="order-card-header">
                <div>
                  <span className="order-number-tag">Order ID: <strong>{order.orderId}</strong></span>
                  <span className="order-date-tag"><FiClock /> {formatDate(order.date)}</span>
                </div>
                <div className="order-badges-wrapper">
                  <span className="order-type-badge">{order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                  <span className="order-status-badge pending">Pending</span>
                </div>
              </div>

              {/* Items List */}
              <div className="order-card-body">
                <h3>Items Summary</h3>
                <div className="order-items-grid">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-detail-row">
                      <img src={item.image} alt={item.name} className="order-item-thumb" />
                      <div className="order-item-detail-info">
                        <h4>{item.name}</h4>
                        <span className="order-item-meta-txt">
                          {item.category.toUpperCase()} &bull; Qty: {item.quantity} &bull; Price: ₹{item.price}
                        </span>
                      </div>
                      <strong className="order-item-subtotal-price">₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {order.orderType === 'delivery' && order.address && (
                <div className="order-card-address-block">
                  <h4><FiMapPin /> Delivery Address</h4>
                  <p>{order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  {order.address.instructions && (
                    <p className="order-address-instructions">Note: {order.address.instructions}</p>
                  )}
                </div>
              )}

              {/* Summary Totals */}
              <div className="order-card-footer">
                <div className="order-totals-box">
                  <div className="totals-row">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="totals-row">
                    <span>Delivery Charges:</span>
                    <span className="free-delivery">FREE</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="totals-row grand-total">
                    <span>Grand Total:</span>
                    <strong>₹{order.total}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Dev helper notice banner */}
            <div className="demo-credentials-info" style={{ marginTop: '30px' }}>
              <p>💡 <strong>Development Phase Note</strong>: This panel is currently reading simulated order logs from `localStorage`. In future database phases, this page will interact with dynamic backend routing (`GET /api/orders`) and update status states dynamically.</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
