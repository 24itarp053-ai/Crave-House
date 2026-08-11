import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  FiGrid, FiList, FiShoppingBag, FiCalendar, FiDollarSign,
  FiTrendingUp, FiEdit2, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import {
  ownerStats, mockOrders, mockReservations, mockMenuItems, mockTables, analyticsData
} from '../data/adminMockData';
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
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Restaurant Overview</h1>
        <span className="dash-page-subtitle">Today's live snapshot — mock frontend data.</span>
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
          <a href="/owner/orders" className="dash-see-all">See All</a>
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
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="dash-id-cell">{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.items} item{o.items > 1 ? 's' : ''}</td>
                  <td>₹{o.amount}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Orders page ──────────────────────────────────────────────────────────────
function OwnerOrders() {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  const visible = filter === 'All' ? mockOrders : mockOrders.filter((o) => o.status === filter);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1>Orders</h1>
        <span className="dash-page-subtitle">Frontend-only filter — connect to API in next milestone.</span>
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
