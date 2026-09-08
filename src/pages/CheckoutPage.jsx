import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiMapPin, FiMail, FiPhone, FiUser, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { createOrder } from '../services/orderService';
import '../pizza-page.css';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to place your order.' } });
    }
  }, [isAuthenticated, loading, navigate]);

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // Check if we already have an order placed in this cycle (to avoid race-condition redirection)
      const lastOrder = localStorage.getItem('craveHouseLastOrder');
      if (!lastOrder) {
        navigate('/cart');
      }
    }
  }, [cartItems, navigate]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState('delivery'); // 'delivery', 'pickup', or 'dine-in'
  
  // Delivery address states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [pincode, setPincode] = useState('');
  const [instructions, setInstructions] = useState('');

  // Dine In states
  const [tableNumber, setTableNumber] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [dineInInstructions, setDineInInstructions] = useState('');

  // Pre-fill if customer is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [isAuthenticated, user]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (orderType === 'delivery') {
      if (!address.trim()) {
        newErrors.address = 'Delivery address is required.';
      }
      if (!city.trim()) {
        newErrors.city = 'City is required.';
      }
      if (!pincode.trim()) {
        newErrors.pincode = 'Pincode is required.';
      } else if (!/^\d{6}$/.test(pincode.trim())) {
        newErrors.pincode = 'Please enter a valid 6-digit pincode.';
      }
    } else if (orderType === 'dine-in') {
      if (!tableNumber) {
        newErrors.tableNumber = 'Table Number is required.';
      }
      const guestsVal = parseInt(numberOfGuests, 10);
      if (isNaN(guestsVal) || guestsVal < 1) {
        newErrors.numberOfGuests = 'Number of guests must be at least 1.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const orderPayload = {
      orderType,
      customer: {
        name: fullName,
        email: email,
        phone: phone
      },
      address: orderType === 'delivery' ? {
        address,
        city,
        state: deliveryState,
        pincode,
        instructions
      } : undefined,
      dineInDetails: orderType === 'dine-in' ? {
        tableNumber,
        numberOfGuests: parseInt(numberOfGuests, 10) || 1,
        dineInInstructions
      } : undefined,
      items: cartItems.map(item => ({
        menuItem: item.id,
        quantity: item.quantity
      })),
      payment: {
        method: 'COD',
        status: 'Pending'
      }
    };

    try {
      const data = await createOrder(orderPayload);
      if (data.success && data.order) {
        // Create compatibility object for OrderSuccessPage
        const successOrder = {
          orderId: data.order.orderNumber,
          total: data.order.pricing.total,
          orderType: data.order.orderType,
          address: data.order.address,
          dineInDetails: data.order.dineInDetails
        };
        localStorage.setItem('craveHouseLastOrder', JSON.stringify(successOrder));
        
        // Clear cart ONLY after successful order creation
        clearCart();

        // Navigate to order success screen
        navigate('/order-success');
      } else {
        setErrorMessage(data.message || 'Unable to place your order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errMsg = error.message || 'Unable to place your order. Please try again.';
      setErrorMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pizza-page">
      {/* Header */}
      <header className="pizza-nav">
        <Link to="/" className="pizza-brand">
          <span>CH</span>
          <i>Crave House</i>
        </Link>

        <Link to="/cart" className="pizza-back">
          <FiArrowLeft /> Back to Cart
        </Link>

        <div className="pizza-cart-header-indicator">
          <FiShoppingBag /> Checkout
        </div>
      </header>

      {/* Banner */}
      <section className="pizza-hero" style={{ background: '#26150f' }}>
        <p className="eyebrow">FINAL STEP</p>
        <h1>
          Complete Your
          <br />
          <em>Checkout.</em>
        </h1>
        <p>Review details, choose fulfillment type, and place your simulated order.</p>
      </section>

      {/* Checkout Content Grid */}
      <div className="product-details-container" style={{ padding: '60px max(6vw, 24px) 80px' }}>
        <form onSubmit={handlePlaceOrder} className="cart-grid checkout-grid-layout" noValidate>
          
          {/* Left Column: Forms */}
          <div className="checkout-form-column">
            
            {/* Section 1: Customer Info */}
            <div className="checkout-section-card">
              <h3>1. Customer Information</h3>
              <div className="summary-divider" />
              
              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-icon-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(p => ({ ...p, fullName: '' }));
                      }}
                      className={errors.fullName ? 'input-error' : ''}
                    />
                  </div>
                  {errors.fullName && <span className="inline-error-msg">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-icon-wrapper">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(p => ({ ...p, phone: '' }));
                      }}
                      className={errors.phone ? 'input-error' : ''}
                    />
                  </div>
                  {errors.phone && <span className="inline-error-msg">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '15px' }}>
                <label htmlFor="email">Email Address</label>
                <div className="input-icon-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(p => ({ ...p, email: '' }));
                    }}
                    className={errors.email ? 'input-error' : ''}
                  />
                </div>
                {errors.email && <span className="inline-error-msg">{errors.email}</span>}
              </div>
            </div>

            {/* Section 2: Order Type */}
            <div className="checkout-section-card" style={{ marginTop: '30px' }}>
              <h3>2. Order Fulfillment</h3>
              <div className="summary-divider" />

              <div className="fulfillment-selection">
                <label className="fulfillment-card">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={orderType === 'delivery'}
                    onChange={() => {
                      setOrderType('delivery');
                      setErrors(p => ({ ...p, address: '', city: '', pincode: '', tableNumber: '', numberOfGuests: '' }));
                    }}
                  />
                  <div className="fulfillment-card-content">
                    <span className="radio-circle"></span>
                    <div>
                      <strong>Delivery</strong>
                      <p>Doorstep delivery within 30-45 mins</p>
                    </div>
                  </div>
                </label>

                <label className="fulfillment-card">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={orderType === 'pickup'}
                    onChange={() => {
                      setOrderType('pickup');
                      setErrors(p => ({ ...p, address: '', city: '', pincode: '', tableNumber: '', numberOfGuests: '' }));
                    }}
                  />
                  <div className="fulfillment-card-content">
                    <span className="radio-circle"></span>
                    <div>
                      <strong>Takeaway / Pickup</strong>
                      <p>Pick up from restaurant in 20 mins</p>
                    </div>
                  </div>
                </label>

                <label className="fulfillment-card">
                  <input
                    type="radio"
                    name="orderType"
                    value="dine-in"
                    checked={orderType === 'dine-in'}
                    onChange={() => {
                      setOrderType('dine-in');
                      setErrors(p => ({ ...p, address: '', city: '', pincode: '', tableNumber: '', numberOfGuests: '' }));
                    }}
                  />
                  <div className="fulfillment-card-content">
                    <span className="radio-circle"></span>
                    <div>
                      <strong>Dine In</strong>
                      <p>Order directly from your table inside restaurant</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Fulfillment Option Specific Fields */}
              {orderType === 'delivery' ? (
                <div className="delivery-fields-wrapper">
                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <div className="input-icon-wrapper">
                      <FiMapPin className="input-icon" />
                      <input
                        type="text"
                        id="address"
                        placeholder="House no, Building, Street name"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (errors.address) setErrors(p => ({ ...p, address: '' }));
                        }}
                        className={errors.address ? 'input-error' : ''}
                      />
                    </div>
                    {errors.address && <span className="inline-error-msg">{errors.address}</span>}
                  </div>

                  <div className="form-grid-three" style={{ marginTop: '15px' }}>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        placeholder="New Delhi"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city) setErrors(p => ({ ...p, city: '' }));
                        }}
                        className={errors.city ? 'input-error' : ''}
                      />
                      {errors.city && <span className="inline-error-msg">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        placeholder="Delhi"
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pincode">Pincode</label>
                      <input
                        type="text"
                        id="pincode"
                        placeholder="110001"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          if (errors.pincode) setErrors(p => ({ ...p, pincode: '' }));
                        }}
                        className={errors.pincode ? 'input-error' : ''}
                      />
                      {errors.pincode && <span className="inline-error-msg">{errors.pincode}</span>}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label htmlFor="instructions">Delivery Instructions (Optional)</label>
                    <textarea
                      id="instructions"
                      placeholder="E.g. Leave at gate, ring bell, call on arrival..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="checkout-textarea"
                    />
                  </div>
                </div>
              ) : orderType === 'dine-in' ? (
                <div className="dine-in-fields-wrapper" style={{ marginTop: '20px' }}>
                  <div className="form-grid-two">
                    <div className="form-group">
                      <label htmlFor="tableNumber">Table Number *</label>
                      <select
                        id="tableNumber"
                        value={tableNumber}
                        onChange={(e) => {
                          setTableNumber(e.target.value);
                          if (errors.tableNumber) setErrors(p => ({ ...p, tableNumber: '' }));
                        }}
                        className={`checkout-select ${errors.tableNumber ? 'input-error' : ''}`}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          borderRadius: '8px',
                          border: errors.tableNumber ? '1px solid #e53935' : '1px solid #decfc6',
                          background: '#fff',
                          fontSize: '14px',
                          color: '#333'
                        }}
                      >
                        <option value="">-- Select Table Number --</option>
                        {Array.from({ length: 12 }, (_, i) => `Table ${i + 1}`).map((tbl) => (
                          <option key={tbl} value={tbl}>{tbl}</option>
                        ))}
                      </select>
                      {errors.tableNumber && <span className="inline-error-msg">{errors.tableNumber}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="numberOfGuests">Number of Guests *</label>
                      <input
                        type="number"
                        id="numberOfGuests"
                        min="1"
                        placeholder="e.g. 2"
                        value={numberOfGuests}
                        onChange={(e) => {
                          setNumberOfGuests(e.target.value);
                          if (errors.numberOfGuests) setErrors(p => ({ ...p, numberOfGuests: '' }));
                        }}
                        className={errors.numberOfGuests ? 'input-error' : ''}
                      />
                      {errors.numberOfGuests && <span className="inline-error-msg">{errors.numberOfGuests}</span>}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label htmlFor="dineInInstructions">Dine-In Instructions (Optional)</label>
                    <textarea
                      id="dineInInstructions"
                      placeholder="E.g. Less spicy, no onions, extra napkins..."
                      value={dineInInstructions}
                      onChange={(e) => setDineInInstructions(e.target.value)}
                      className="checkout-textarea"
                    />
                  </div>
                </div>
              ) : (
                /* Pickup Card */
                <div className="pickup-info-card">
                  <FiInfo className="pickup-info-icon" />
                  <div>
                    <strong>Crave House Main Restaurant</strong>
                    <p>Connaught Place, Radial Road 3, New Delhi, 110001</p>
                    <span className="pickup-timing">Fulfillment Time: approx. 20-25 mins</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="checkout-summary-column">
            <div className="cart-summary-card">
              <h3>Order Review</h3>
              <div className="summary-divider" />
              
              {/* Item List */}
              <div className="checkout-items-list">
                {cartItems.map((item) => (
                  <div key={`${item.category}-${item.id}`} className="checkout-item-row">
                    <img src={item.image} alt={item.name} className="checkout-item-thumb" />
                    <div className="checkout-item-info">
                      <h4>{item.name}</h4>
                      <span>Qty: {item.quantity} × ₹{item.price}</span>
                    </div>
                    <strong className="checkout-item-row-total">₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />
              
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{cartSubtotal}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-delivery">FREE</span>
              </div>

              <div className="summary-divider" />
              
              <div className="summary-row total-row">
                <span>Order Total</span>
                <strong>₹{cartTotal}</strong>
              </div>

              {errorMessage && (
                <div className="auth-alert error" style={{ marginTop: '15px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff2f2', border: '1px solid #f5c6cb', color: '#9b3a3a', borderRadius: '4px', fontSize: '14px' }}>
                  <FiInfo /> <span>{errorMessage}</span>
                </div>
              )}

              {/* Dev notification info */}
              <div className="demo-credentials-info" style={{ marginTop: '15px', background: '#fdfcf9' }}>
                <p>💡 Placing an order clears the cart and saves details to local order history.</p>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ marginTop: '20px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <FiCheckCircle /> Place Order (₹{cartTotal})
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

      <Footer />
    </main>
  );
}
