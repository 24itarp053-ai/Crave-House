import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  FiGrid, FiList, FiShoppingBag, FiCalendar, FiDollarSign,
  FiTrendingUp, FiEdit2, FiToggleLeft, FiToggleRight, FiClock, FiMapPin,
  FiMail, FiPhone, FiUser, FiAlertCircle
} from 'react-icons/fi';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import {
  ownerStats, mockReservations, mockMenuItems, mockTables, analyticsData
} from '../data/adminMockData';
import { getOwnerOrders, getOwnerOrderById, updateOrderStatus } from '../services/orderService';
import { OrderDetailsModal } from './AdminDashboard';
import '../pizza-page.css';

// ─── Shared nav items for Owner ───────────────────────────────────────────────
const ownerNav = [
  { label: 'Dashboard',    to: '/owner',                icon: <FiGrid /> },
  { label: 'Orders',       to: '/owner/orders',          icon: <FiShoppingBag /> },
  { label: 'Menu',         to: '/owner/menu',            icon: <FiList /> },
  { label: 'Tables',       to: '/owner/tables',          icon: <FiGrid /> },
  { label: 'Reservations', to: '/owner/reservations',    icon: <FiCalendar /> },
  { label: 'Sales',        to: '/owner/sales',           icon: <FiDollarSign /> },
];

// ─── Overview ─────────────────────────────────────────────────────────────────
function OwnerOverview() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await getOwnerOrders({ limit: 5 });
        if (res.success && res.orders) {
          setRecentOrders(res.orders);
        }
      } catch (e) {
        console.error('Error loading recent owner orders:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRecent();
  }, []);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Restaurant Overview</h1>
        <span className="dash-page-subtitle">Today's live snapshot — real database orders.</span>
      </div>

      <div className="stat-cards-grid">
        <StatCard label="Today's Orders"       value={ownerStats.todayOrders}       icon={<FiShoppingBag />} accent="#d4a373" />
        <StatCard label="Today's Revenue"      value={ownerStats.todayRevenue}       icon={<FiDollarSign />}  accent="#4caf50" prefix="₹" />
        <StatCard label="Pending Orders"       value={ownerStats.pendingOrders}      icon={<FiTrendingUp />}  accent="#ff9800" />
        <StatCard label="Today's Reservations" value={ownerStats.todayReservations}  icon={<FiCalendar />}    accent="#9c27b0" />
      </div>

      <div className="dash-section-card" style={{ marginTop: 32 }}>
        <div className="dash-section-header">
          <h2>Recent Orders</h2>
          <Link to="/owner/orders" className="dash-see-all">See All</Link>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="dash-empty-row">Loading...</td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o._id || o.id}>
                    <td className="dash-id-cell">{o.orderNumber || o.id}</td>
                    <td>{o.customer?.name || o.customer}</td>
                    <td>{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</td>
                    <td>₹{o.pricing?.total || o.amount}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))
              )}
              {!loading && recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="dash-empty-row">No orders recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Orders page ──────────────────────────────────────────────────────────────
function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: 10,
        status: filter === 'All' ? undefined : filter
      };
      const res = await getOwnerOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalOrders(res.pagination?.total || 0);
      } else {
        setError('Failed to retrieve orders.');
      }
    } catch (err) {
      console.error('Error fetching owner orders:', err);
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filter]);

  // Load detail order
  useEffect(() => {
    if (!selectedOrderId) {
      setSelectedOrder(null);
      return;
    }
    async function fetchDetail() {
      setLoadingDetail(true);
      setModalError('');
      try {
        const res = await getOwnerOrderById(selectedOrderId);
        if (res.success && res.order) {
          setSelectedOrder(res.order);
        } else {
          setModalError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching owner order detail:', err);
        setModalError(err.message || 'Failed to fetch details.');
      } finally {
        setLoadingDetail(false);
      }
    }
    fetchDetail();
  }, [selectedOrderId]);

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    setModalError('');
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success && res.order) {
        setSelectedOrder(res.order);
        setOrders(prev => prev.map(o => (o.id === orderId || o._id === orderId) ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setModalError(err.message || 'Failed to update operational status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Orders</h1>
        <span className="dash-page-subtitle">Restaurant operational control and status dispatching.</span>
      </div>

      <div className="dash-filter-row">
        {statuses.map((s) => (
          <button
            key={s}
            className={`dash-filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="dash-section-card">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="dash-empty-row">Loading orders...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="dash-empty-row" style={{ color: '#9b3a3a' }}>{error}</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="dash-empty-row">No orders match this filter.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id || o.id}>
                    <td
                      className="dash-id-cell"
                      style={{ cursor: 'pointer', textDecoration: 'underline', color: '#d4a373', fontWeight: 'bold' }}
                      onClick={() => setSelectedOrderId(o._id || o.id)}
                    >
                      {o.orderNumber || o.id}
                    </td>
                    <td>{o.customer?.name || o.customer}</td>
                    <td>{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</td>
                    <td>₹{o.pricing?.total || o.amount}</td>
                    <td style={{ textTransform: 'capitalize' }}>{o.orderType || o.type}</td>
                    <td className="dash-muted">{formatDate(o.createdAt)}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '15px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Page {page} of {totalPages} (Total: {totalOrders} orders)
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="dash-filter-btn"
                style={{ margin: 0, opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="dash-filter-btn"
                style={{ margin: 0, opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal
          selectedOrderId={selectedOrderId}
          selectedOrder={selectedOrder}
          loadingDetail={loadingDetail}
          modalError={modalError}
          isUpdatingStatus={isUpdatingStatus}
          isUpdatingPayment={false}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={() => {}}
          handleClose={() => setSelectedOrderId(null)}
          role="owner"
        />
      )}
    </div>
  );
}

// ─── Menu page ────────────────────────────────────────────────────────────────
function OwnerMenu() {
  const [items, setItems] = useState(mockMenuItems);

  const toggle = (id) => {
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, available: !m.available } : m));
  };

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Menu</h1>
        <span className="dash-page-subtitle">Availability toggles are frontend-only in this milestone.</span>
      </div>

      <div className="dash-section-card">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.category}</td>
                  <td>₹{m.price}</td>
                  <td>⭐ {m.rating}</td>
                  <td>
                    <button
                      className={`dash-toggle-btn ${m.available ? 'on' : 'off'}`}
                      onClick={() => toggle(m.id)}
                      aria-label={`Toggle ${m.name}`}
                    >
                      {m.available ? <><FiToggleRight /> Available</> : <><FiToggleLeft /> Unavailable</>}
                    </button>
                  </td>
                  <td>
                    <button className="dash-icon-btn edit" aria-label={`Edit ${m.name}`}><FiEdit2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tables page ──────────────────────────────────────────────────────────────
const TABLE_STATUSES = ['Available', 'Reserved', 'Occupied', 'Maintenance'];

function OwnerTables() {
  const [tables, setTables] = useState(mockTables);

  const cycleStatus = (id) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = TABLE_STATUSES[(TABLE_STATUSES.indexOf(t.status) + 1) % TABLE_STATUSES.length];
        return { ...t, status: next };
      })
    );
  };

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Tables</h1>
        <span className="dash-page-subtitle">Frontend-only status cycling — connect to API later.</span>
      </div>

      {/* Summary */}
      <div className="stat-cards-grid">
        {TABLE_STATUSES.map((s) => (
          <StatCard
            key={s}
            label={`${s} Tables`}
            value={tables.filter((t) => t.status === s).length}
            icon={<FiGrid />}
            accent={s === 'Available' ? '#4caf50' : s === 'Reserved' ? '#ff9800' : s === 'Occupied' ? '#2196f3' : '#f44336'}
          />
        ))}
      </div>

      {/* Table cards */}
      <div className="tables-grid" style={{ marginTop: 28 }}>
        {tables.map((t) => (
          <div key={t.id} className={`table-card status-${t.status.toLowerCase()}`}>
            <div className="table-card-top">
              <span className="table-label">{t.label}</span>
              <StatusBadge status={t.status} />
            </div>
            <div className="table-card-capacity">
              Capacity: <strong>{t.capacity}</strong> guests
            </div>
            <button
              className="dash-action-btn"
              onClick={() => cycleStatus(t.id)}
              style={{ marginTop: 12, width: '100%' }}
            >
              Change Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reservations page ────────────────────────────────────────────────────────
function OwnerReservations() {
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(mockReservations.map((r) => [r.id, r.status]))
  );

  const cycle = (id) => {
    const order = ['Pending', 'Confirmed', 'Cancelled'];
    const cur = statuses[id];
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setStatuses((prev) => ({ ...prev, [id]: next }));
  };

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Reservations</h1>
        <span className="dash-page-subtitle">Frontend-only status controls — will connect to API later.</span>
      </div>
      <div className="dash-section-card">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockReservations.map((r) => (
                <tr key={r.id}>
                  <td className="dash-id-cell">{r.id}</td>
                  <td>{r.customer}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.guests}</td>
                  <td>{r.table}</td>
                  <td><StatusBadge status={statuses[r.id]} /></td>
                  <td>
                    <button className="dash-action-btn" onClick={() => cycle(r.id)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Sales page ───────────────────────────────────────────────────────────────
function OwnerSales() {
  const maxRevenue = Math.max(...analyticsData.revenueByDay.map((d) => d.amount));

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Sales</h1>
        <span className="dash-page-subtitle">Mock frontend sales data — connect to API in next milestone.</span>
      </div>

      <div className="stat-cards-grid">
        <StatCard label="Today's Revenue"  value={ownerStats.todayRevenue}   icon={<FiDollarSign />}  accent="#4caf50" prefix="₹" />
        <StatCard label="Weekly Revenue"   value={ownerStats.weeklyRevenue}   icon={<FiTrendingUp />}  accent="#d4a373" prefix="₹" />
        <StatCard label="Monthly Revenue"  value={ownerStats.monthlyRevenue}  icon={<FiDollarSign />}  accent="#2196f3" prefix="₹" />
        <StatCard label="Avg Order Value"  value={ownerStats.avgOrderValue}   icon={<FiDollarSign />}  accent="#9c27b0" prefix="₹" />
      </div>

      {/* Revenue Bar Chart */}
      <div className="dash-section-card" style={{ marginTop: 28 }}>
        <div className="dash-section-header"><h2>Daily Revenue — Last 7 Days</h2></div>
        <div className="analytics-bar-chart">
          {analyticsData.revenueByDay.map((d) => (
            <div key={d.day} className="analytics-bar-col">
              <span className="analytics-bar-value">₹{(d.amount / 1000).toFixed(1)}k</span>
              <div
                className="analytics-bar"
                style={{ height: `${Math.round((d.amount / maxRevenue) * 160)}px` }}
              />
              <span className="analytics-bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="dash-section-card" style={{ marginTop: 24 }}>
        <div className="dash-section-header"><h2>Sales by Category</h2></div>
        <div className="analytics-progress-list">
          {analyticsData.ordersByCategory.map((c) => (
            <div key={c.category} className="analytics-progress-row">
              <div className="analytics-progress-label">
                <span>{c.category}</span>
                <span>{c.orders} orders ({c.percentage}%)</span>
              </div>
              <div className="analytics-progress-track">
                <div className="analytics-progress-fill" style={{ width: `${c.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root export with nested routing ─────────────────────────────────────────
export default function OwnerDashboard() {
  return (
    <DashboardLayout role="owner" title="Owner Panel" navItems={ownerNav}>
      <Routes>
        <Route index element={<OwnerOverview />} />
        <Route path="orders" element={<OwnerOrders />} />
        <Route path="menu" element={<OwnerMenu />} />
        <Route path="tables" element={<OwnerTables />} />
        <Route path="reservations" element={<OwnerReservations />} />
        <Route path="sales" element={<OwnerSales />} />
        <Route path="*" element={<Navigate to="/owner" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
