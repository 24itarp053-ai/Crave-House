import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiArrowRight, FiInfo } from 'react-icons/fi';
import Footer from '../components/Footer';
import '../pizza-page.css';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('craveHouseLastOrder');
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading craveHouseLastOrder:', e);
    }
  }, []);

  return (
    <main className="pizza-page">
      {/* Header */}
      <header className="pizza-nav">
        <Link to="/" className="pizza-brand">
          <span>CH</span>
          <i>Crave House</i>
        </Link>
      </header>

      {/* Success Content Wrapper */}
      <section className="auth-container success-page-container">
        <div className="auth-card success-card">
          <div className="success-icon-wrapper">
            <FiCheckCircle />
          </div>
          
          <h2>Order Confirmed!</h2>
          <p className="success-thankyou">Thank you for ordering from Crave House. Your order has been received and is being prepared.</p>

          {order ? (
            <div className="order-details-summary-box">
              <div className="summary-row">
                <span>Order ID:</span>
                <strong className="order-id-label">{order.orderId}</strong>
              </div>
              <div className="summary-row">
                <span>Order Total:</span>
                <strong className="order-price-label">₹{order.total}</strong>
              </div>
              <div className="summary-row">
                <span>Fulfillment:</span>
                <strong style={{ textTransform: 'capitalize' }}>{order.orderType}</strong>
              </div>
              {order.orderType === 'delivery' && order.address && (
                <div className="summary-delivery-address-info">
                  <span>Delivering to:</span>
                  <p>{order.address.address}, {order.address.city} - {order.address.pincode}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="order-details-summary-box">
              <p>Unable to retrieve order details from browser session.</p>
            </div>
          )}

          {/* Development note banner */}
          <div className="demo-credentials-info" style={{ marginTop: '20px', background: '#fdfcf9' }}>
            <p><FiInfo /> This checkout flow is simulated on the frontend. Password, real orders, and checkout APIs will be added in future database integrations.</p>
          </div>

          {/* Action Buttons */}
          <div className="success-buttons-grid">
            <Link to="/orders" className="auth-btn">
              View My Orders
            </Link>
            <Link to="/order" className="guest-btn continue-btn">
              Continue Shopping <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
