/**
 * adminMockData.js
 * 
 * Centralized mock/static data for Admin & Owner dashboards.
 * 
 * IMPORTANT: This is frontend-only placeholder data.
 * Replace each data set with API responses when the backend is ready:
 *   GET /api/orders      → mockOrders
 *   GET /api/customers   → mockCustomers
 *   GET /api/reservations → mockReservations
 *   GET /api/menu        → mockMenuItems
 *   GET /api/analytics   → adminStats / ownerStats
 */

// ─── Admin KPI Stats ────────────────────────────────────────────────────────
export const adminStats = {
  totalOrders: 248,
  revenue: 78450,
  customers: 156,
  reservations: 64,
  pendingOrders: 18,
  completedOrders: 214,
  cancelledOrders: 16,
  avgOrderValue: 316,
};

// ─── Owner KPI Stats (today) ─────────────────────────────────────────────────
export const ownerStats = {
  todayOrders: 32,
  todayRevenue: 8420,
  pendingOrders: 7,
  todayReservations: 11,
  weeklyRevenue: 52800,
  monthlyRevenue: 218400,
  avgOrderValue: 263,
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const mockOrders = [
  { id: '#CH-1024', customer: 'Rahul Shah',    items: 2, amount: 698,  status: 'Preparing',  type: 'Delivery', time: '10:32 AM' },
  { id: '#CH-1023', customer: 'Priya Mehta',   items: 3, amount: 1249, status: 'Completed',  type: 'Pickup',   time: '10:18 AM' },
  { id: '#CH-1022', customer: 'Aarav Patel',   items: 1, amount: 379,  status: 'Pending',    type: 'Delivery', time: '10:05 AM' },
  { id: '#CH-1021', customer: 'Neha Gupta',    items: 4, amount: 1596, status: 'Confirmed',  type: 'Delivery', time: '09:54 AM' },
  { id: '#CH-1020', customer: 'Vikram Singh',  items: 2, amount: 748,  status: 'Ready',      type: 'Pickup',   time: '09:40 AM' },
  { id: '#CH-1019', customer: 'Sunita Rao',    items: 3, amount: 897,  status: 'Cancelled',  type: 'Delivery', time: '09:22 AM' },
  { id: '#CH-1018', customer: 'Dev Sharma',    items: 2, amount: 628,  status: 'Completed',  type: 'Pickup',   time: '09:10 AM' },
  { id: '#CH-1017', customer: 'Ananya Iyer',   items: 1, amount: 249,  status: 'Completed',  type: 'Delivery', time: '08:58 AM' },
  { id: '#CH-1016', customer: 'Mohan Das',     items: 5, amount: 1895, status: 'Preparing',  type: 'Delivery', time: '08:45 AM' },
  { id: '#CH-1015', customer: 'Kavya Nair',    items: 2, amount: 768,  status: 'Completed',  type: 'Pickup',   time: '08:30 AM' },
];

// ─── Customers ────────────────────────────────────────────────────────────────
export const mockCustomers = [
  { id: 'C001', name: 'Rahul Shah',    email: 'rahul@example.com',  phone: '9876543210', orders: 12, reservations: 4, spent: 5890, status: 'Active'   },
  { id: 'C002', name: 'Priya Mehta',   email: 'priya@example.com',  phone: '9812345678', orders: 8,  reservations: 2, spent: 3240, status: 'Active'   },
  { id: 'C003', name: 'Aarav Patel',   email: 'aarav@example.com',  phone: '9823456789', orders: 5,  reservations: 1, spent: 1890, status: 'Active'   },
  { id: 'C004', name: 'Neha Gupta',    email: 'neha@example.com',   phone: '9834567890', orders: 20, reservations: 7, spent: 8760, status: 'Active'   },
  { id: 'C005', name: 'Vikram Singh',  email: 'vikram@example.com', phone: '9845678901', orders: 3,  reservations: 0, spent: 987,  status: 'Inactive' },
  { id: 'C006', name: 'Sunita Rao',    email: 'sunita@example.com', phone: '9856789012', orders: 15, reservations: 5, spent: 6120, status: 'Active'   },
  { id: 'C007', name: 'Dev Sharma',    email: 'dev@example.com',    phone: '9867890123', orders: 7,  reservations: 3, spent: 2890, status: 'Active'   },
  { id: 'C008', name: 'Ananya Iyer',   email: 'ananya@example.com', phone: '9878901234', orders: 4,  reservations: 1, spent: 1560, status: 'Active'   },
  { id: 'C009', name: 'Mohan Das',     email: 'mohan@example.com',  phone: '9889012345', orders: 9,  reservations: 2, spent: 3450, status: 'Inactive' },
  { id: 'C010', name: 'Kavya Nair',    email: 'kavya@example.com',  phone: '9890123456', orders: 11, reservations: 6, spent: 4890, status: 'Active'   },
];

// ─── Reservations ─────────────────────────────────────────────────────────────
export const mockReservations = [
  { id: '#CH-R1024', customer: 'Alice Roy',     email: 'alice@example.com',  date: '2026-08-20', time: '19:30', guests: 4, table: 'T05', status: 'Pending'   },
  { id: '#CH-R1023', customer: 'Bob Singh',     email: 'bob@example.com',    date: '2026-08-20', time: '20:00', guests: 2, table: 'T02', status: 'Confirmed' },
  { id: '#CH-R1022', customer: 'Cathy Nair',    email: 'cathy@example.com',  date: '2026-08-21', time: '13:00', guests: 6, table: 'T07', status: 'Pending'   },
  { id: '#CH-R1021', customer: 'Dev Patel',     email: 'dev@example.com',    date: '2026-08-21', time: '19:00', guests: 3, table: 'T03', status: 'Confirmed' },
  { id: '#CH-R1020', customer: 'Eva Mehta',     email: 'eva@example.com',    date: '2026-08-22', time: '20:30', guests: 5, table: 'T06', status: 'Cancelled' },
  { id: '#CH-R1019', customer: 'Farhan Shaikh', email: 'farhan@example.com', date: '2026-08-22', time: '18:30', guests: 2, table: 'T01', status: 'Pending'   },
  { id: '#CH-R1018', customer: 'Gita Sharma',   email: 'gita@example.com',   date: '2026-08-23', time: '19:30', guests: 8, table: 'T08', status: 'Confirmed' },
];

// ─── Menu Items (combined from all categories for management view) ─────────────
export const mockMenuItems = [
  { id: 'P1', name: 'Margherita Pizza',    category: 'Pizza',    price: 249,  rating: 4.8, available: true  },
  { id: 'P2', name: 'Farmhouse Pizza',     category: 'Pizza',    price: 349,  rating: 4.7, available: true  },
  { id: 'P3', name: 'Paneer Tikka Pizza',  category: 'Pizza',    price: 379,  rating: 4.9, available: true  },
  { id: 'P4', name: 'Veggie Supreme',      category: 'Pizza',    price: 359,  rating: 4.8, available: false },
  { id: 'P5', name: 'Cheese Burst Pizza',  category: 'Pizza',    price: 399,  rating: 4.9, available: true  },
  { id: 'B1', name: 'Veg Classic Burger',  category: 'Burger',   price: 199,  rating: 4.5, available: true  },
  { id: 'B2', name: 'Paneer Burger',       category: 'Burger',   price: 249,  rating: 4.6, available: true  },
  { id: 'B3', name: 'Corn Cheese Burger',  category: 'Burger',   price: 279,  rating: 4.7, available: true  },
  { id: 'A1', name: 'Alfredo Pasta',       category: 'Pasta',    price: 299,  rating: 4.6, available: true  },
  { id: 'A2', name: 'Red Sauce Pasta',     category: 'Pasta',    price: 279,  rating: 4.5, available: true  },
  { id: 'A3', name: 'White Sauce Pasta',   category: 'Pasta',    price: 289,  rating: 4.7, available: false },
  { id: 'S1', name: 'Caesar Veg Salad',    category: 'Salad',    price: 229,  rating: 4.4, available: true  },
  { id: 'S2', name: 'Greek Salad',         category: 'Salad',    price: 249,  rating: 4.5, available: true  },
  { id: 'D1', name: 'Mango Shake',         category: 'Drinks',   price: 149,  rating: 4.6, available: true  },
  { id: 'D2', name: 'Chocolate Shake',     category: 'Drinks',   price: 169,  rating: 4.7, available: true  },
  { id: 'E1', name: 'Chocolate Brownie',   category: 'Desserts', price: 189,  rating: 4.8, available: true  },
  { id: 'E2', name: 'Tiramisu',            category: 'Desserts', price: 249,  rating: 4.9, available: true  },
  { id: 'E3', name: 'Cheesecake',          category: 'Desserts', price: 229,  rating: 4.8, available: false },
];

// ─── Tables ───────────────────────────────────────────────────────────────────
export const mockTables = [
  { id: 'T01', label: 'Table T01', capacity: 2,  status: 'Available'   },
  { id: 'T02', label: 'Table T02', capacity: 4,  status: 'Reserved'    },
  { id: 'T03', label: 'Table T03', capacity: 4,  status: 'Occupied'    },
  { id: 'T04', label: 'Table T04', capacity: 2,  status: 'Available'   },
  { id: 'T05', label: 'Table T05', capacity: 6,  status: 'Reserved'    },
  { id: 'T06', label: 'Table T06', capacity: 6,  status: 'Available'   },
  { id: 'T07', label: 'Table T07', capacity: 8,  status: 'Occupied'    },
  { id: 'T08', label: 'Table T08', capacity: 8,  status: 'Available'   },
  { id: 'T09', label: 'Table T09', capacity: 4,  status: 'Maintenance' },
  { id: 'T10', label: 'Table T10', capacity: 2,  status: 'Available'   },
  { id: 'T11', label: 'Table T11', capacity: 10, status: 'Available'   },
  { id: 'T12', label: 'Table T12', capacity: 10, status: 'Reserved'    },
];

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsData = {
  revenueByDay: [
    { day: 'Mon', amount: 9800  },
    { day: 'Tue', amount: 12400 },
    { day: 'Wed', amount: 8700  },
    { day: 'Thu', amount: 15200 },
    { day: 'Fri', amount: 18900 },
    { day: 'Sat', amount: 22400 },
    { day: 'Sun', amount: 19600 },
  ],
  ordersByCategory: [
    { category: 'Pizza',    orders: 98,  percentage: 40 },
    { category: 'Burger',   orders: 62,  percentage: 25 },
    { category: 'Pasta',    orders: 44,  percentage: 18 },
    { category: 'Salads',   orders: 22,  percentage: 9  },
    { category: 'Drinks',   orders: 14,  percentage: 6  },
    { category: 'Desserts', orders: 8,   percentage: 3  },
  ],
  topFoods: [
    { name: 'Cheese Burst Pizza',  orders: 42, revenue: 16758 },
    { name: 'Paneer Tikka Pizza',  orders: 38, revenue: 14402 },
    { name: 'Corn Cheese Burger',  orders: 31, revenue: 8649  },
    { name: 'Tiramisu',            orders: 28, revenue: 6972  },
    { name: 'Chocolate Brownie',   orders: 24, revenue: 4536  },
  ],
};
