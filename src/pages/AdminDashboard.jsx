import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  FiGrid, FiList, FiShoppingBag, FiCalendar, FiUsers, FiBarChart2,
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiEdit2, FiTrash2,
  FiToggleLeft, FiToggleRight, FiSearch, FiPlus
} from 'react-icons/fi';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import { adminStats, mockOrders, mockCustomers, mockReservations, mockMenuItems, analyticsData } from '../data/adminMockData';
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
  const recentOrders = mockOrders.slice(0, 5);
  const recentReservations = mockReservations.slice(0, 4);

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
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="dash-id-cell">{o.id}</td>
                    <td>{o.customer}</td>
                    <td>₹{o.amount}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
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
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  const visible = filter === 'All' ? mockOrders : mockOrders.filter((o) => o.status === filter);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Orders</h1>
        <span className="dash-page-subtitle">Mock order data — connect to API in next milestone.</span>
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
              {visible.map((o) => (
                <tr key={o.id}>
                  <td className="dash-id-cell">{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.items} item{o.items > 1 ? 's' : ''}</td>
                  <td>₹{o.amount}</td>
                  <td>{o.type}</td>
                  <td className="dash-muted">{o.time}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="dash-empty-row">No orders match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
