import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PizzaPage from './pages/PizzaPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import OrderPage from './pages/OrderPage';
import BookTablePage from './pages/BookTablePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffLoginPage from './pages/StaffLoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/menu/pizza" element={<PizzaPage />} />
            <Route path="/menu/pizza/:id" element={<ProductDetail />} />
            <Route path="/menu/burger" element={<CategoryPage category="burger" />} />
            <Route path="/menu/burger/:id" element={<ProductDetail />} />
            <Route path="/menu/pasta" element={<CategoryPage category="pasta" />} />
            <Route path="/menu/pasta/:id" element={<ProductDetail />} />
            <Route path="/menu/salad" element={<CategoryPage category="salad" />} />
            <Route path="/menu/salad/:id" element={<ProductDetail />} />
            <Route path="/menu/drinks" element={<CategoryPage category="drinks" />} />
            <Route path="/menu/drinks/:id" element={<ProductDetail />} />
            <Route path="/menu/desserts" element={<CategoryPage category="desserts" />} />
            <Route path="/menu/desserts/:id" element={<ProductDetail />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/book-table" element={<BookTablePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/staff-login" element={<StaffLoginPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            
            {/* Protected Customer Routes */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Restaurant Owner Routes */}
            <Route 
              path="/owner" 
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}
