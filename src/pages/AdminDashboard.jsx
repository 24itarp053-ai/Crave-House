import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  FiGrid, FiList, FiShoppingBag, FiCalendar, FiUsers, FiBarChart2,
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiEdit2, FiTrash2,
  FiToggleLeft, FiToggleRight, FiSearch, FiPlus, FiClock, FiMapPin,
  FiMail, FiPhone, FiUser, FiAlertCircle
} from 'react-icons/fi';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import { adminStats, mockCustomers, mockReservations, mockMenuItems, analyticsData } from '../data/adminMockData';
import { getAdminOrders, getAdminOrderById, updateOrderStatus, updateOrderPaymentStatus } from '../services/orderService';
import '../pizza-page.css';

// ─── Shared nav items for Admin ───────────────────────────────────────────────
const adminNav = [
  { label: 'Dashboard',   to: '/admin',               icon: <FiGrid /> },
  { label: 'Orders',      to: '/admin/orders',         icon: <FiShoppingBag /> },
  { label: 'Reservations',to: '/admin/reservations',   icon: <FiCalendar /> },
  { label: 'Menu',        to: '/admin/menu',           icon: <FiList /> },
  { label: 'Customers',   to: '/admin/customers',      icon: <FiUsers /> },
  { label: 'Analytics',   to: '/admin/analytics',      icon: <FiBarChart2 /> },
];

// ─── Overview page ────────────────────────────────────────────────────────────
function AdminOverview() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const recentReservations = mockReservations.slice(0, 4);

  useEffect(() => {
    async function loadRecent() {
      try {
        const res = await getAdminOrders({ limit: 5 });
        if (res.success && res.orders) {
          setRecentOrders(res.orders);
        }
      } catch (e) {
        console.error('Error loading recent orders:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRecent();
  }, []);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Dashboard Overview</h1>
        <span className="dash-page-subtitle">Welcome back — here's what's happening today.</span>
      </div>

      {/* KPI Stats */}
      <div className="stat-cards-grid">
        <StatCard label="Total Orders"  value={adminStats.totalOrders}  icon={<FiShoppingBag />} accent="#d4a373" />
        <StatCard label="Total Revenue" value={adminStats.revenue}       icon={<FiDollarSign />}  accent="#4caf50" prefix="₹" />
        <StatCard label="Customers"     value={adminStats.customers}     icon={<FiUsers />}       accent="#2196f3" />
        <StatCard label="Reservations"  value={adminStats.reservations}  icon={<FiCalendar />}    accent="#9c27b0" />
      </div>

      {/* Secondary stats */}
      <div className="stat-cards-grid" style={{ marginTop: 16 }}>
        <StatCard label="Pending Orders"   value={adminStats.pendingOrders}   icon={<FiTrendingUp />}   accent="#ff9800" />
        <StatCard label="Completed Orders" value={adminStats.completedOrders} icon={<FiTrendingDown />} accent="#4caf50" />
        <StatCard label="Avg Order Value"  value={adminStats.avgOrderValue}   icon={<FiDollarSign />}   accent="#d4a373" prefix="₹" />
        <StatCard label="Cancelled Orders" value={adminStats.cancelledOrders} icon={<FiTrash2 />}       accent="#f44336" />
      </div>

      {/* Recent Orders + Reservations */}
      <div className="dash-two-col" style={{ marginTop: 32 }}>
        {/* Recent Orders */}
        <div className="dash-section-card">
          <div className="dash-section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="dash-see-all">See All</Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="dash-empty-row">Loading...</td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o._id || o.id}>
                      <td className="dash-id-cell">{o.orderNumber || o.id}</td>
                      <td>{o.customer?.name || o.customer}</td>
                      <td>₹{o.pricing?.total || o.amount}</td>
                      <td><StatusBadge status={o.status} /></td>
                    </tr>
                  ))
                )}
                {!loading && recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="dash-empty-row">No orders recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="dash-section-card">
          <div className="dash-section-header">
            <h2>Recent Reservations</h2>
            <Link to="/admin/reservations" className="dash-see-all">See All</Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="dash-id-cell">{r.id}</td>
                    <td>{r.customer}</td>
                    <td>{r.date}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Orders page ──────────────────────────────────────────────────────────────
function AdminOrders() {
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
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

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
      const res = await getAdminOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalOrders(res.pagination?.total || 0);
      } else {
        setError('Failed to retrieve orders.');
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
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
        const res = await getAdminOrderById(selectedOrderId);
        if (res.success && res.order) {
          setSelectedOrder(res.order);
        } else {
          setModalError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching admin order detail:', err);
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

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    setIsUpdatingPayment(true);
    setModalError('');
    try {
      const res = await updateOrderPaymentStatus(orderId, newPaymentStatus);
      if (res.success && res.order) {
        setSelectedOrder(res.order);
        setOrders(prev => prev.map(o => (o.id === orderId || o._id === orderId) ? { ...o, payment: { ...o.payment, status: newPaymentStatus } } : o));
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      setModalError(err.message || 'Failed to update payment status.');
    } finally {
      setIsUpdatingPayment(false);
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
        <span className="dash-page-subtitle">Real-time order management dashboard connected to database.</span>
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
          isUpdatingPayment={isUpdatingPayment}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={handlePaymentStatusChange}
          handleClose={() => setSelectedOrderId(null)}
          role="admin"
        />
      )}
    </div>
  );
}

// ─── Reservations page ────────────────────────────────────────────────────────
function AdminReservations() {
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
                    <button className="dash-action-btn" onClick={() => cycle(r.id)}>
                      Update
                    </button>
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

// ─── Menu Management page ─────────────────────────────────────────────────────
function AdminMenu() {
  const [items, setItems] = useState(mockMenuItems);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const categories = ['All', ...new Set(mockMenuItems.map((m) => m.category))];

  const visible = items.filter((m) => {
    const matchCat = catFilter === 'All' || m.category === catFilter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAvailability = (id) => {
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, available: !m.available } : m));
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Menu Management</h1>
        <button className="dash-primary-btn"><FiPlus /> Add Food Item</button>
      </div>
      <p className="dash-note">Frontend-only controls. Delete/Edit/Add will connect to API in the next milestone.</p>

      <div className="dash-toolbar">
        <div className="dash-search-wrap">
          <FiSearch className="dash-search-icon" />
          <input
            type="text"
            placeholder="Search food items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dash-search-input"
          />
        </div>
        <div className="dash-filter-row" style={{ margin: 0 }}>
          {categories.map((c) => (
            <button
              key={c}
              className={`dash-filter-btn ${catFilter === c ? 'active' : ''}`}
              onClick={() => setCatFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((m) => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.category}</td>
                  <td>₹{m.price}</td>
                  <td>⭐ {m.rating}</td>
                  <td>
                    <button
                      className={`dash-toggle-btn ${m.available ? 'on' : 'off'}`}
                      onClick={() => toggleAvailability(m.id)}
                      aria-label={`Toggle availability for ${m.name}`}
                    >
                      {m.available ? <><FiToggleRight /> Available</> : <><FiToggleLeft /> Unavailable</>}
                    </button>
                  </td>
                  <td className="dash-actions-cell">
                    <button className="dash-icon-btn edit" aria-label={`Edit ${m.name}`}><FiEdit2 /></button>
                    <button className="dash-icon-btn delete" onClick={() => deleteItem(m.id)} aria-label={`Delete ${m.name}`}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={6} className="dash-empty-row">No items match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Customers page ───────────────────────────────────────────────────────────
function AdminCustomers() {
  const [search, setSearch] = useState('');
  const visible = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Customers</h1>
        <span className="dash-page-subtitle">{mockCustomers.length} registered customers</span>
      </div>

      <div className="dash-toolbar">
        <div className="dash-search-wrap">
          <FiSearch className="dash-search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dash-search-input"
          />
        </div>
      </div>

      <div className="dash-section-card">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Reservations</th>
                <th>Total Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td className="dash-muted">{c.email}</td>
                  <td className="dash-muted">{c.phone}</td>
                  <td>{c.orders}</td>
                  <td>{c.reservations}</td>
                  <td>₹{c.spent.toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="dash-empty-row">No customers match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics page ───────────────────────────────────────────────────────────
function AdminAnalytics() {
  const maxRevenue = Math.max(...analyticsData.revenueByDay.map((d) => d.amount));

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Analytics</h1>
        <span className="dash-page-subtitle">Mock frontend analytics — will connect to real data in next milestone.</span>
      </div>

      {/* Summary KPIs */}
      <div className="stat-cards-grid">
        <StatCard label="Total Revenue"     value={adminStats.revenue}       icon={<FiDollarSign />}  accent="#4caf50" prefix="₹" />
        <StatCard label="Avg Order Value"   value={adminStats.avgOrderValue}  icon={<FiTrendingUp />}  accent="#d4a373" prefix="₹" />
        <StatCard label="Total Orders"      value={adminStats.totalOrders}    icon={<FiShoppingBag />} accent="#2196f3" />
        <StatCard label="Completed Orders"  value={adminStats.completedOrders}icon={<FiBarChart2 />}   accent="#9c27b0" />
      </div>

      <div className="dash-two-col" style={{ marginTop: 32 }}>
        {/* Revenue by Day bar chart */}
        <div className="dash-section-card">
          <div className="dash-section-header"><h2>Revenue — Last 7 Days</h2></div>
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

        {/* Orders by Category */}
        <div className="dash-section-card">
          <div className="dash-section-header"><h2>Orders by Category</h2></div>
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

      {/* Top foods */}
      <div className="dash-section-card" style={{ marginTop: 24 }}>
        <div className="dash-section-header"><h2>Top Performing Items</h2></div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Food Item</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topFoods.map((f, i) => (
                <tr key={f.name}>
                  <td className="dash-muted">{i + 1}</td>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.orders}</td>
                  <td>₹{f.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Root export with nested routing ─────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Admin Panel" navItems={adminNav}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

// Vite image resolution module loader
const imageModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default'
});

const resolveImage = (imagePath) => {
  if (imagePath && typeof imagePath === 'string') {
    const filename = imagePath.split('/').pop();
    const mapKey = `../assets/images/${filename}`;
    if (imageModules[mapKey]) {
      return imageModules[mapKey];
    }
  }
  return imagePath;
};

// ─── Shared Order Details Modal ──────────────────────────────────────────────
export function OrderDetailsModal({
  selectedOrderId,
  selectedOrder,
  loadingDetail,
  modalError,
  isUpdatingStatus,
  isUpdatingPayment,
  handleStatusChange,
  handlePaymentStatusChange,
  handleClose,
  role
}) {
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dash-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }} onClick={handleClose}>
      <div className="dash-modal-content" style={{
        background: '#fff',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'relative',
        color: '#333'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button onClick={handleClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          border: 'none',
          background: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          lineHeight: 1
        }} aria-label="Close modal">&times;</button>

        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 style={{ margin: 0 }}>Loading order details...</h3>
          </div>
        ) : modalError ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9b3a3a' }}>
            <FiAlertCircle size={40} style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: 0 }}>{modalError}</h3>
            <button onClick={handleClose} className="dash-filter-btn" style={{ marginTop: '15px' }}>Close</button>
          </div>
        ) : !selectedOrder ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3 style={{ margin: 0 }}>No order selected.</h3>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: '0 0 15px', color: '#1a1a1a' }}>
              Order ID: {selectedOrder.orderNumber}
            </h2>
            <div className="summary-divider" style={{ margin: '15px 0', height: '1px', background: '#eee' }} />

            {/* Grid details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px', textAlign: 'left' }}>
              
              {/* Left Side: Items & Fulfillment */}
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Fulfillment Status</h4>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id || selectedOrder.id, e.target.value)}
                    disabled={isUpdatingStatus}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: '#fff',
                      fontSize: '14px',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Items Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                      <img src={resolveImage(item.image)} alt={item.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', color: '#1a1a1a' }}>{item.name}</strong>
                        <span style={{ color: '#666' }}>Qty: {item.quantity} &bull; Price: ₹{item.price}</span>
                      </div>
                      <strong style={{ color: '#1a1a1a' }}>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                {selectedOrder.orderType === 'delivery' && selectedOrder.address && (
                  <div>
                    <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Delivery Address</h4>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', color: '#333' }}>
                      {selectedOrder.address.address}, {selectedOrder.address.city}, {selectedOrder.address.state || ''} - {selectedOrder.address.pincode}
                    </p>
                    {selectedOrder.address.instructions && (
                      <p style={{ margin: '8px 0 0', padding: '6px 10px', background: '#fefcf8', borderLeft: '3px solid #d4a373', fontSize: '12px', color: '#7a5c3e', fontStyle: 'italic', borderRadius: '0 4px 4px 0' }}>
                        <strong>Note:</strong> {selectedOrder.address.instructions}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side: Pricing & Customer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Customer Details</h4>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    <div><strong>Name:</strong> {selectedOrder.customer.name}</div>
                    <div><strong>Email:</strong> {selectedOrder.customer.email}</div>
                    <div><strong>Phone:</strong> {selectedOrder.customer.phone}</div>
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Payment & Billing</h4>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    <div><strong>Method:</strong> {selectedOrder.payment.method}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <strong>Status:</strong>
                      {role === 'admin' ? (
                        <select
                          value={selectedOrder.payment.status}
                          onChange={(e) => handlePaymentStatusChange(selectedOrder._id || selectedOrder.id, e.target.value)}
                          disabled={isUpdatingPayment}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#fff',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {['Pending', 'Paid', 'Failed', 'Refunded'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{
                          fontWeight: 'bold',
                          color: selectedOrder.payment.status === 'Paid' ? '#2e7d32' : selectedOrder.payment.status === 'Refunded' ? '#d32f2f' : '#b08200'
                        }}>{selectedOrder.payment.status}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fdfcf9', padding: '15px', borderRadius: '4px', border: '1px solid #e0d5c1' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '13px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.5px' }}>Pricing Breakdowns</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.pricing?.subtotal || selectedOrder.subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Delivery:</span>
                      <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>FREE</span>
                    </div>
                    <div className="summary-divider" style={{ margin: '5px 0', height: '1px', background: '#e0d5c1' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px', color: '#1a1a1a' }}>
                      <span>Total Amount:</span>
                      <span>₹{selectedOrder.pricing?.total || selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {modalError && (
              <div style={{ marginTop: '20px', padding: '10px 15px', background: '#fff2f2', border: '1px solid #f5c6cb', color: '#9b3a3a', borderRadius: '4px', fontSize: '13px', textAlign: 'center' }}>
                {modalError}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
