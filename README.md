# Crave House

**Crave House** is a full-stack restaurant web application that enables customers to browse a live menu, add items to a cart, place delivery, pickup, or dine-in orders, and book tables online. The project includes role-restricted dashboards for an **Admin** (full system control) and a **Restaurant Owner** (operational visibility), backed by a RESTful Node.js/Express API and a MongoDB database.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Backend API](#backend-api)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database Models](#database-models)
- [Seed Data](#seed-data)
- [Available NPM Scripts](#available-npm-scripts)
- [Build and Production Preview](#build-and-production-preview)
- [Troubleshooting](#troubleshooting)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Testing / Utility Scripts](#testing--utility-scripts)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

### Customer-Facing

| Feature | Description |
|---|---|
| **Home Page** | Landing page with hero, category highlights, menu sections, reviews, and contact |
| **Menu Browsing** | Browse items by category: Pizza, Burgers, Pasta, Salads, Drinks, Desserts |
| **Product Detail Page** | Full item page: description, ingredients, nutrition info, rating, review count |
| **Shopping Cart** | Add/remove items, adjust quantities; cart is persisted in `localStorage` |
| **Checkout** | Select delivery, pickup, or dine-in, provide address or table details, choose payment method (COD, Card, UPI, NetBanking) |
| **Dine-In Ordering** | Place orders directly from a restaurant table by selecting table number, guest count, and optional dining instructions |
| **Order Placement** | Creates a real order in MongoDB with a unique order number and full pricing breakdown |
| **Order Success Page** | Confirmation screen after successful order submission |
| **My Orders** | Authenticated customers can view their full order history |
| **Order Details** | Detailed view of an individual order: status, items, and pricing |
| **Table Booking** | Submit a reservation with date, time, guest count, and special requests |
| **My Reservations** | View and track reservation history and statuses |
| **User Registration** | Customer self-registration with name, email, phone, and password |
| **User Login** | JWT-based login for customers at `/login` |
| **Customer Dashboard** | Account overview at `/account` (protected, customer role only) |

### Admin Dashboard (`/admin/*`)

- **Overview** — Total orders, revenue, customers, reservations, pending and completed orders
- **Orders** — Browse all orders, view details, update order status and payment status
- **Reservations** — View all reservations, confirm or cancel them
- **Menu Management** — View all items (including unavailable ones), create, edit, toggle availability, delete
- **Customers** — List registered customers, view profiles, update Active/Inactive status
- **Analytics** — Live KPIs via MongoDB aggregations: total revenue, average order value, top-selling items, revenue by category, daily/monthly trends

### Owner Dashboard (`/owner/*`)

- **Overview** — Today's orders, today's revenue, pending orders, weekly/monthly revenue, average order value
- **Orders** — View and manage orders; update order status
- **Menu Management** — Create and edit menu items (delete is admin-only)
- **Tables** — Table status overview (uses static mock data in `adminMockData.js`)
- **Reservations** — View all reservations, confirm or cancel them
- **Sales Analytics** — Live revenue analytics via the owner-specific analytics endpoint

### Staff

- **Staff Login Page** — Separate login at `/staff-login` for Admin and Owner roles with role-based routing after authentication

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | latest | UI component library |
| **Vite** | latest | Build tool and development server |
| **@vitejs/plugin-react** | latest | React fast-refresh and JSX transform |
| **React Router DOM** | ^7.18.2 | Client-side routing |
| **Framer Motion** | ^12.9.2 | Animations and transitions |
| **React Icons** | ^5.5.0 | Icon library (Feather Icons used throughout) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | — | JavaScript runtime |
| **Express** | ^4.19.2 | Web framework and routing |
| **Mongoose** | ^8.3.1 | MongoDB ODM |
| **jsonwebtoken** | ^9.0.2 | JWT generation and verification |
| **bcryptjs** | ^2.4.3 | Password hashing |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| **dotenv** | ^16.4.5 | Environment variable loading |
| **nodemon** | ^3.1.0 | Dev dependency — auto-restarts server on file change |

### Database

| Technology | Purpose |
|---|---|
| **MongoDB** | Primary NoSQL database |
| **Mongoose** | Schema definition and data validation layer |

---

## Project Architecture

```
Frontend (React / Vite — port 5173)
        |
        |  HTTP REST API calls
        |  Authorization: Bearer <token>
        v
Backend (Node.js / Express — port 5000)
        |
        |  Mongoose ODM
        v
MongoDB (crave_house database)
```

- **Frontend (React/Vite)** — Renders the UI, manages state with React Context (`AuthContext`, `CartContext`). All API calls are centralized in `src/services/` and use `VITE_API_URL`.
- **Backend (Node.js/Express)** — RESTful JSON API. All routes are prefixed with `/api`. The `protect` middleware validates JWTs; the `authorize` middleware enforces roles.
- **Database (MongoDB)** — Stores all persistent data. Mongoose handles schema definition, validation, indexing, and pre-save hooks. Default database name: `crave_house`.

---

## Project Structure

```
Hotel2.0/                           <- Project root (frontend)
+-- .env.example                    <- Frontend environment variable template
+-- .gitignore
+-- index.html                      <- Vite HTML entry point
+-- package.json                    <- Frontend dependencies and scripts
+-- src/
|   +-- main.jsx                    <- React application entry point
|   +-- App.jsx                     <- Root component, router, context providers
|   +-- style.css                   <- Global styles
|   +-- pizza-page.css              <- Extended styles for menu and dashboard pages
|   +-- explore.css                 <- Styles for the explore/menu section
|   +-- assets/                     <- Static images and media
|   +-- components/                 <- Reusable UI components
|   |   +-- Navbar.jsx
|   |   +-- HeroSection.jsx
|   |   +-- CategoriesSection.jsx
|   |   +-- CategoryCard.jsx
|   |   +-- MenuSection.jsx
|   |   +-- PizzaCard.jsx
|   |   +-- ProductCard.jsx
|   |   +-- AboutSection.jsx
|   |   +-- BenefitsSection.jsx
|   |   +-- ReviewsSection.jsx
|   |   +-- ContactSection.jsx
|   |   +-- Footer.jsx
|   |   +-- ExploreMenu.jsx
|   |   +-- ProtectedRoute.jsx      <- Route guard (role-based access control)
|   |   +-- dashboard/
|   |       +-- DashboardLayout.jsx  <- Shared sidebar layout for dashboards
|   |       +-- StatCard.jsx         <- KPI stat card component
|   |       +-- StatusBadge.jsx      <- Order/reservation status indicator
|   +-- context/
|   |   +-- AuthContext.jsx         <- Auth state: login, register, logout, session restore
|   |   +-- CartContext.jsx         <- Cart state, persisted in localStorage
|   +-- data/                       <- Static/fallback data files
|   |   +-- categories.js
|   |   +-- menuData.js
|   |   +-- pizzaData.js
|   |   +-- burgerData.js
|   |   +-- pastaData.js
|   |   +-- saladData.js
|   |   +-- drinksData.js
|   |   +-- dessertData.js
|   |   +-- adminMockData.js        <- Static table data for owner dashboard
|   +-- pages/
|   |   +-- HomePage.jsx
|   |   +-- PizzaPage.jsx
|   |   +-- CategoryPage.jsx        <- Generic category listing page
|   |   +-- ProductDetail.jsx       <- Single menu item detail
|   |   +-- CartPage.jsx
|   |   +-- CheckoutPage.jsx
|   |   +-- OrderSuccessPage.jsx
|   |   +-- OrderPage.jsx
|   |   +-- MyOrdersPage.jsx
|   |   +-- OrderDetailsPage.jsx
|   |   +-- BookTablePage.jsx
|   |   +-- MyReservationsPage.jsx
|   |   +-- LoginPage.jsx           <- Customer login
|   |   +-- RegisterPage.jsx        <- Customer registration
|   |   +-- StaffLoginPage.jsx      <- Admin / Owner login
|   |   +-- CustomerDashboard.jsx   <- /account (customer role)
|   |   +-- AdminDashboard.jsx      <- /admin/* (admin role)
|   |   +-- OwnerDashboard.jsx      <- /owner/* (owner role)
|   |   +-- NotFoundPage.jsx
|   +-- services/                   <- Centralized API call modules (use VITE_API_URL)
|   |   +-- menuService.js          <- Categories, menu items, admin menu CRUD
|   |   +-- orderService.js         <- Create order, customer/admin/owner order fetches
|   |   +-- reservationService.js   <- Create and fetch reservations
|   |   +-- userService.js          <- Profile, password, admin user management
|   |   +-- analyticsService.js     <- Admin and owner analytics endpoints
|   +-- utils/                      <- (Empty directory)
+-- server/                         <- Backend (Node.js/Express)
    +-- .env.example                <- Backend environment variable template
    +-- package.json
    +-- src/
        +-- server.js               <- Express app setup, middleware, routes, startup
        +-- config/
        |   +-- db.js               <- MongoDB connection via Mongoose
        +-- controllers/            <- Request handlers (business logic)
        |   +-- authController.js
        |   +-- categoryController.js
        |   +-- menuController.js
        |   +-- orderController.js
        |   +-- reservationController.js
        |   +-- userController.js
        |   +-- analyticsController.js
        +-- middleware/
        |   +-- authMiddleware.js   <- protect (JWT check) + authorize (role check)
        +-- models/                 <- Mongoose schemas
        |   +-- User.js
        |   +-- Category.js
        |   +-- MenuItem.js
        |   +-- Order.js
        |   +-- Reservation.js
        +-- routes/                 <- Express routers
        |   +-- authRoutes.js
        |   +-- categoryRoutes.js
        |   +-- menuRoutes.js
        |   +-- orderRoutes.js
        |   +-- reservationRoutes.js
        |   +-- userRoutes.js
        |   +-- analyticsRoutes.js
        +-- utils/
            +-- jwt.js              <- generateToken / verifyToken helpers
            +-- seedUsers.js        <- Seeds admin and owner accounts
            +-- seedMenu.js         <- Seeds categories and menu items
            +-- testAnalyticsApi.js
            +-- testMenuApi.js
            +-- testOrder.js
            +-- testOrderApi.js
            +-- testOrderApi4C.js
            +-- testPasswordApi.js
            +-- testReservationApi.js
            +-- testUserApi.js
```

---

## Prerequisites

| Software | Purpose |
|---|---|
| **Node.js** (v18 or later recommended) | Runtime for both frontend tooling and backend |
| **npm** (bundled with Node.js) | Package manager |
| **MongoDB** (v6 or later recommended) | Local database server, or a MongoDB Atlas cluster |

---

## Installation

### 1. Clone / Open the Project

```bash
git clone <your-repository-url>
cd Hotel2.0
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Frontend Environment Variables

Create a `.env` file in the project root:

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

Contents of `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

> `VITE_API_URL` tells the frontend where to send API requests. Change this if your backend runs on a different host or port.

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

### 5. Configure Backend Environment Variables

```bash
# From the project root (Windows PowerShell):
Copy-Item server\.env.example server\.env
```

Open `server/.env` and fill in the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crave_house
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_own_strong_secret_replace_this
JWT_EXPIRES_IN=7d
```

> **Important:** Replace `JWT_SECRET` with a long, random, private string. This secret signs all JWTs and must never be shared or committed to version control.

---

## Database Setup

Crave House uses **MongoDB**. The backend connects using Mongoose via the `MONGODB_URI` environment variable.

### Local MongoDB

```powershell
# Windows — start MongoDB as a Windows service:
net start MongoDB

# Or start mongod manually (specify your data directory):
mongod
```

The `crave_house` database and all collections are created automatically by Mongoose on first write. No manual database or collection setup is required.

### MongoDB Atlas (Cloud)

Replace `MONGODB_URI` in `server/.env` with your Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/crave_house?retryWrites=true&w=majority
```

---

## Running the Project

Open **two separate terminal windows**.

### Terminal 1 — Frontend

```bash
# From the project root (Hotel2.0/)
npm run dev
```

Frontend available at: **http://localhost:5173**

### Terminal 2 — Backend

```bash
cd server
npm run dev
```

Backend API available at: **http://localhost:5000**

> **MongoDB must be running before the backend starts.** The backend exits with an error if it cannot connect to MongoDB on startup.

### Verify the API is Running

Navigate to:

```
http://localhost:5000/api/health
```

**Connected (HTTP 200):**

```json
{
  "success": true,
  "message": "Crave House API is running",
  "database": "connected"
}
```

**Database unavailable (HTTP 503):**

```json
{
  "success": false,
  "message": "Crave House API is running but Database connection is not ready",
  "database": "disconnected"
}
```

---

## Backend API

All routes are prefixed with `/api`. CORS is configured to allow requests from `http://localhost:5173` (Vite dev) and `http://localhost:4173` (Vite preview).

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Returns API and database connection status |

---

### /api/auth — Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Register a new customer account |
| `POST` | `/api/auth/login` | None | Authenticate and receive a JWT token |
| `GET` | `/api/auth/profile` | protect | Get the authenticated user's profile |
| `GET` | `/api/auth/admin-test` | protect + admin | Admin-role access test endpoint |
| `GET` | `/api/auth/owner-test` | protect + owner | Owner-role access test endpoint |

Registration always assigns the `customer` role. The `role` field in the request body is ignored to prevent privilege escalation.

---

### /api/categories — Menu Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | None | List all categories |
| `GET` | `/api/categories/:slug` | None | Get a single category by slug |
| `POST` | `/api/categories` | admin | Create a new category |
| `PUT` | `/api/categories/:id` | admin | Update a category |
| `PATCH` | `/api/categories/:id/status` | admin | Toggle a category's `isActive` status |
| `DELETE` | `/api/categories/:id` | admin | Delete a category |

---

### /api/menu — Menu Items

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/menu` | None | List all available menu items |
| `GET` | `/api/menu/category/:slug` | None | List items for a specific category slug |
| `GET` | `/api/menu/:id` | None | Get a single menu item by ID |
| `GET` | `/api/menu/admin` | admin or owner | List all items including unavailable ones |
| `POST` | `/api/menu` | admin or owner | Create a new menu item |
| `PUT` | `/api/menu/:id` | admin or owner | Update a menu item |
| `PATCH` | `/api/menu/:id/availability` | admin or owner | Toggle a menu item's availability |
| `DELETE` | `/api/menu/:id` | admin | Delete a menu item |

---

### /api/orders — Orders

All order routes require authentication (`protect` is applied globally to this router).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders` | customer | Place a new order |
| `GET` | `/api/orders` | customer | List the authenticated customer's orders |
| `GET` | `/api/orders/:id` | customer | Get a specific order by ID (customer's own) |
| `GET` | `/api/orders/admin` | admin | List all orders (admin view) |
| `GET` | `/api/orders/admin/:id` | admin | Get any order by ID (admin view) |
| `GET` | `/api/orders/owner` | owner | List all orders (owner view) |
| `GET` | `/api/orders/owner/:id` | owner | Get any order by ID (owner view) |
| `PATCH` | `/api/orders/:id/status` | admin or owner | Update an order's operational status |
| `PATCH` | `/api/orders/:id/payment-status` | admin | Update an order's payment status |

---

### /api/users — User Management

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Any authenticated role | Get the authenticated user's profile |
| `PUT` | `/api/users/profile` | Any authenticated role | Update the authenticated user's profile |
| `PUT` | `/api/users/change-password` | customer | Change the authenticated customer's password |
| `GET` | `/api/users` | admin | List all users (paginated) |
| `GET` | `/api/users/:id` | admin | Get a specific user by ID |
| `PUT` | `/api/users/:id` | admin | Update a user's details or role |
| `PATCH` | `/api/users/:id/status` | admin | Update a user's Active/Inactive status |

---

### /api/reservations — Table Reservations

All reservation routes require authentication (`protect` is applied globally to this router).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reservations` | customer | Create a new table reservation |
| `GET` | `/api/reservations` | customer | List the authenticated customer's reservations |
| `GET` | `/api/reservations/admin` | admin or owner | List all reservations |
| `PATCH` | `/api/reservations/:id/status` | admin or owner | Update a reservation's status |

---

### /api/analytics — Dashboard Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/analytics/admin` | admin | Full analytics: revenue, orders, customers, top items, trends |
| `GET` | `/api/analytics/owner` | owner | Owner analytics: today's figures, weekly/monthly revenue, trends |

Analytics are computed live using MongoDB aggregation pipelines.

---

## Authentication and Authorization

### Registration

- Endpoint: `POST /api/auth/register`
- Required fields: `name`, `email`, `password`
- Optional: `phone`
- The `role` field is **always forced to `customer`** on registration. Admin and Owner accounts can only be created via the seed script or direct database access.
- Password must be at least 6 characters. Duplicate emails are rejected.

### Login

- Endpoint: `POST /api/auth/login`
- Returns a signed JWT token and the user object (without password).
- The token is stored in `localStorage` as `craveHouseToken` on the frontend.

### JWT

- Tokens are signed using `JWT_SECRET`.
- Default expiry: `7d` (configurable via `JWT_EXPIRES_IN`).
- JWT payload contains `userId` and `role`.
- On page reload, `AuthContext` calls `GET /api/auth/profile` to restore the session server-side.

### Password Hashing

- Passwords are hashed using **bcryptjs** (salt factor 10) before being stored.
- The `password` field is excluded from all queries by default (`select: false`).

### Middleware

- **`protect`** — Reads the `Authorization: Bearer <token>` header, verifies the JWT, and attaches `req.user = { id, role }` to the request.
- **`authorize(...roles)`** — Checks that `req.user.role` is one of the permitted roles; returns HTTP 403 otherwise.

### User Roles

| Role | Access |
|---|---|
| `customer` | Place orders, view own orders, create/view reservations, manage own profile |
| `admin` | Full system access: all orders, reservations, menu management (including delete), user management, analytics |
| `owner` | Operational access: all orders (update status), menu management (no delete), all reservations, owner analytics |

### Frontend Route Protection

The `ProtectedRoute` component wraps sensitive routes. It redirects unauthenticated users to `/login` and users with an incorrect role to `/`.

---

## Database Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercased |
| `password` | String | Required, excluded from queries by default, hashed via bcrypt pre-save hook |
| `phone` | String | Optional |
| `role` | String | Enum: `customer`, `admin`, `owner` — defaults to `customer` |
| `status` | String | Enum: `Active`, `Inactive` — defaults to `Active` |
| `createdAt`, `updatedAt` | Date | Auto-managed |

### Category

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `slug` | String | Required, unique, lowercased, indexed |
| `description` | String | Optional |
| `image` | String | Image path |
| `isActive` | Boolean | Defaults to `true`, indexed |
| `createdAt`, `updatedAt` | Date | Auto-managed |

### MenuItem

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `slug` | String | Required, unique, lowercased, indexed |
| `price` | Number | Required, non-negative |
| `image` | String | Required |
| `description` | String | Required |
| `category` | ObjectId | Required — references `Category` |
| `rating` | Number | 0–5, defaults to 0 |
| `reviewCount` | Number | Defaults to 0 |
| `ingredients` | [String] | Array of ingredient names |
| `nutrition` | Object | `calories`, `protein`, `fat`, `carbs` (all strings) |
| `isAvailable` | Boolean | Defaults to `true`, indexed |
| `isPopular` | Boolean | Defaults to `false`, indexed |
| `tags` | [String] | Optional tags array |
| `createdAt`, `updatedAt` | Date | Auto-managed |

### Order

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId | References `User`, required |
| `orderNumber` | String | Unique order reference, required |
| `customer.name` | String | Snapshot of customer name at order time |
| `customer.email` | String | Snapshot of customer email |
| `customer.phone` | String | Snapshot of customer phone |
| `orderType` | String | Enum: `delivery`, `pickup`, `dine-in` |
| `address` | Object | `address`, `city`, `state`, `pincode`, `instructions` — required for delivery orders |
| `dineInDetails` | Object | `tableNumber`, `numberOfGuests`, `dineInInstructions` — required for dine-in orders |
| `items` | [OrderItem] | Array of item snapshots: name, image, price, quantity, subtotal |
| `pricing.subtotal` | Number | Required |
| `pricing.tax` | Number | Defaults to 0 |
| `pricing.deliveryFee` | Number | Defaults to 0 |
| `pricing.discount` | Number | Defaults to 0 |
| `pricing.total` | Number | Required |
| `payment.method` | String | Enum: `COD`, `Card`, `UPI`, `NetBanking` — defaults to `COD` |
| `payment.status` | String | Enum: `Pending`, `Paid`, `Failed`, `Refunded` — defaults to `Pending` |
| `status` | String | Enum: `Pending`, `Confirmed`, `Preparing`, `Ready`, `Completed`, `Cancelled` |
| `createdAt`, `updatedAt` | Date | Auto-managed |

### Reservation

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId | References `User`, required |
| `reservationId` | String | Unique reservation reference |
| `customerName` | String | Required |
| `email` | String | Required, lowercased |
| `phone` | String | Required |
| `date` | String | Requested reservation date |
| `time` | String | Requested reservation time |
| `guests` | Number | Minimum 1, required |
| `specialRequest` | String | Optional, defaults to empty string |
| `status` | String | Enum: `Pending`, `Confirmed`, `Cancelled` — defaults to `Pending` |
| `table` | String | Assigned table reference, defaults to `T-TBD` |
| `createdAt`, `updatedAt` | Date | Auto-managed |

---

## Seed Data

### Seed Users

Seeds two privileged accounts (Admin and Owner) into the database.

```bash
# From the server/ directory
npm run seed:users
```

- Requires `MONGODB_URI` to be set in `server/.env`.
- Idempotent: skips any email that already exists in the database.
- Passwords are automatically hashed by the Mongoose `pre('save')` hook.

> **Security Note:** Do not share seed credentials publicly. Open `server/src/utils/seedUsers.js` locally to review the default email addresses and passwords. Change passwords immediately after seeding in any shared or production environment.

### Seed Menu

Seeds all menu categories (Pizza, Burgers, Pasta, Salads, Drinks, Desserts) and their associated menu items.

```bash
# From the server/ directory
npm run seed:menu
```

- Requires `MONGODB_URI` in `server/.env`.
- Creates categories first, then creates menu items referencing those categories.
- Uses upsert logic — no duplicate documents are created.

---

## Available NPM Scripts

### Frontend (run from project root `Hotel2.0/`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts the Vite development server with hot module replacement |
| `build` | `npm run build` | Compiles and bundles the frontend for production into the `dist/` folder |
| `preview` | `npm run preview` | Serves the production build locally for preview (port 4173 by default) |

### Backend (run from `server/` directory)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts the server with `nodemon` (auto-restarts on file changes) |
| `start` | `npm start` | Starts the server with plain `node` (for production use) |
| `seed:users` | `npm run seed:users` | Runs the user seed script |
| `seed:menu` | `npm run seed:menu` | Runs the menu seed script |

---

## Build and Production Preview

### Build the Frontend

```bash
# From the project root
npm run build
```

Creates a production-optimized bundle in the `dist/` directory.

### Preview the Production Build

```bash
# From the project root
npm run preview
```

Serves `dist/` locally at `http://localhost:4173`. The backend CORS configuration already allows this origin.

### Start the Backend in Production Mode

```bash
# From the server/ directory
npm start
```

> **Note:** Additional steps such as process management (PM2), a reverse proxy (Nginx), and environment hardening would be needed before deploying to a production server.

---

## Troubleshooting

### 1. MongoDB Connection Failure

**Symptom:** Backend exits with `MongoDB connection error` or `MONGODB_URI is not defined`.

**Fix:**
- Confirm MongoDB is running: `net start MongoDB` (Windows) or `mongod`.
- Check that `server/.env` exists with a valid `MONGODB_URI`.
- Test the URI in MongoDB Compass or `mongosh`.

### 2. Backend Not Starting

**Symptom:** `npm run dev` in `server/` errors immediately.

**Fix:**
- Run `npm install` inside the `server/` directory.
- Confirm `server/.env` exists with all required variables.

### 3. Frontend Not Starting

**Symptom:** `npm run dev` in the root fails.

**Fix:**
- Run `npm install` in the project root.
- Confirm `node_modules/` exists.

### 4. Port 5173 Already in Use

**Symptom:** `Error: listen EADDRINUSE :::5173`

**Fix (Windows PowerShell):**

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### 5. Port 5000 Already in Use

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change `PORT` in `server/.env` and update `VITE_API_URL` in the root `.env` accordingly.

### 6. CORS Errors

**Symptom:** Browser shows `CORS: origin ... is not allowed`.

**Fix:**
- Verify `CLIENT_URL` in `server/.env` matches the origin shown in the error (e.g., `http://localhost:5173`).
- Restart the backend after editing `.env`.

### 7. MONGODB_URI Missing

**Symptom:** Server exits with `MONGODB_URI is not defined`.

**Fix:**
- Create `server/.env` from `server/.env.example`.
- Ensure the file is in the `server/` directory, not the project root.

### 8. JWT_SECRET Missing or Weak

**Fix:** Generate a strong secret and set it in `server/.env`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 9. API Requests Failing from Frontend

**Symptom:** All API calls return network errors or 404.

**Fix:**
- Confirm the backend is running on port 5000.
- Confirm the root `.env` contains `VITE_API_URL=http://localhost:5000/api`.
- Restart the Vite dev server after changing `.env` (Vite reads env at startup).
- Visit `http://localhost:5000/api/health` to confirm the backend is accessible.

### 10. Dependencies Missing

**Symptom:** `Cannot find module '...'` errors.

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 11. Environment File Incorrectly Configured

**Checklist:**
- Root `.env` at `Hotel2.0/.env` must contain `VITE_API_URL`.
- Backend `.env` at `Hotel2.0/server/.env` must contain `PORT`, `MONGODB_URI`, `CLIENT_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
- Neither file should be committed to version control.

---

## Environment Variables

| Variable | File Location | Purpose | Example Value | Sensitive? |
|---|---|---|---|---|
| `VITE_API_URL` | `Hotel2.0/.env` | Base URL the frontend uses for all API calls | `http://localhost:5000/api` | No |
| `PORT` | `server/.env` | Port the Express server listens on | `5000` | No |
| `MONGODB_URI` | `server/.env` | MongoDB connection string | `mongodb://127.0.0.1:27017/crave_house` | **Yes** |
| `CLIENT_URL` | `server/.env` | Allowed CORS origin for the frontend | `http://localhost:5173` | No |
| `JWT_SECRET` | `server/.env` | Secret key used to sign and verify JWTs | *(generate a strong random string)* | **Yes** |
| `JWT_EXPIRES_IN` | `server/.env` | JWT token lifetime | `7d` | No |

> Never commit `.env` files to version control. Treat `MONGODB_URI` and `JWT_SECRET` as secrets.

---

## Development Workflow

Recommended startup order:

1. **Start MongoDB** — confirm the service is running.
2. **Start the backend** — open a terminal in `server/` and run `npm run dev`.
3. **Verify the API** — visit `http://localhost:5000/api/health` and confirm `"database": "connected"`.
4. **Start the frontend** — open a second terminal in the project root and run `npm run dev`.
5. **Open the app** — navigate to `http://localhost:5173`.

### How Frontend API Calls Reach the Backend

All service modules in `src/services/` read `import.meta.env.VITE_API_URL` at build time. In development this resolves to `http://localhost:5000/api`. Every `fetch` call targets this base URL.

The JWT token stored in `localStorage` (`craveHouseToken`) is attached by service modules as the `Authorization: Bearer <token>` header for all protected requests.

---

## Testing / Utility Scripts

The `server/src/utils/` directory contains standalone Node.js scripts for manually verifying API behavior. These are **not** automated test suites — they must be run with the server and MongoDB already running.

| Script | Run Command | What it Tests |
|---|---|---|
| `testAnalyticsApi.js` | `node src/utils/testAnalyticsApi.js` | Analytics endpoints, auth/role checks, KPI correctness after seeding |
| `testMenuApi.js` | `node src/utils/testMenuApi.js` | Menu and category CRUD endpoints |
| `testOrder.js` | `node src/utils/testOrder.js` | Order creation and retrieval |
| `testOrderApi.js` | `node src/utils/testOrderApi.js` | Full order API flow |
| `testOrderApi4C.js` | `node src/utils/testOrderApi4C.js` | Extended order API test scenarios |
| `testPasswordApi.js` | `node src/utils/testPasswordApi.js` | Password change and validation |
| `testReservationApi.js` | `node src/utils/testReservationApi.js` | Reservation creation, listing, status updates |
| `testUserApi.js` | `node src/utils/testUserApi.js` | User profile, admin user management |

Run all scripts from the `server/` directory.

---

## Security Notes

- **Never commit `.env` files.** The `.gitignore` is already configured to exclude them.
- **Use a strong `JWT_SECRET`.** A cryptographically random string of at least 64 characters. Weak secrets allow token forgery.
- **Do not expose database credentials.** Keep `MONGODB_URI` private. Rotate credentials if exposed.
- **Role escalation is prevented.** The `register` endpoint hard-codes the `customer` role and ignores any `role` field in the request body.
- **Passwords are never returned in API responses.** The User schema excludes `password` from all queries by default and strips it in the `toJSON` transform.
- **Apply appropriate MongoDB access controls in production.** Create a dedicated MongoDB user with only the permissions needed for the `crave_house` database.

---

## Future Improvements

Potential enhancements not currently implemented:

- **Email notifications** — Confirmation emails for orders and reservations.
- **Real payment gateway integration** — Replace payment method selection with a live processor such as Razorpay or Stripe.
- **Image upload** — Allow admins/owners to upload menu item images via the dashboard instead of using file path strings.
- **Automated testing** — Migrate manual utility scripts to a proper test framework (e.g., Jest or Mocha).
- **Frontend pagination** — Add proper pagination controls to the admin orders and customer list pages.
- **Refresh tokens** — Implement refresh token rotation for improved session security without requiring frequent re-logins.
- **Rate limiting** — Add request rate limiting on auth endpoints to prevent brute-force attacks.
- **Staff role** — Introduce a dedicated `staff` role for front-of-house employees with limited operational access.
- **Progressive Web App (PWA)** — Add a service worker for offline support and installability.

---

## License

License information has not been specified.
