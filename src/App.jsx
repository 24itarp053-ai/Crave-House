import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PizzaPage from './pages/PizzaPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import OrderPage from './pages/OrderPage';
import BookTablePage from './pages/BookTablePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu/pizza" element={<PizzaPage />} />
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
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
