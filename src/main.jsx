import React from 'react'; 
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products";
import Analytics from "./pages/Departments/Restaurant/Analytics/Analytics.jsx";

import { NotificationProvider } from './context/NotificationContext.jsx';
import RestaurantPOS from './components/restaurant/RestaurantPOS';
import Dashboard from './pages/Departments/Restaurant/Dashboard/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/restaurant/categories" element={<ResCategories />} />
            <Route path="/restaurant/products" element={<Products />} />
            <Route path="/restaurant/create-order" element={<RestaurantPOS />} />
            <Route path="/restaurant/dashboard" element={<Dashboard />} />
            <Route path="/restaurant/analytics" element={<Analytics />} />
          </Routes>
        </Router>
      </NotificationProvider>
  </StrictMode>
);