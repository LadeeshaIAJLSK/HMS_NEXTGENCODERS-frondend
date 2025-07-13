import React from 'react'; // Add this line
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products";

import Info1 from "./pages/Departments/Reception/DOReservations/info1/Info1";

import RoomHome from "./pages/Departments/Owner/OwnRooms/RoomHome.jsx";
import SettingsPage from "./pages/Departments/Owner/OwnSettings/OwnSettings.jsx";
import TransactionReport from "./pages/Departments/Owner/OwnReports/TransactionReports.jsx";
import StockReport from "./pages/Departments/Owner/OwnReports/StockRepo.jsx";
import CheckoutPage from "./pages/Departments/Owner/OwnReports/Checkout.jsx";
import OwnerDashboard from "./pages/Departments/Owner/OwnDashboard/OwnDashboard.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/restaurant/categories" element={<ResCategories />} />
        <Route path="/restaurant/products" element={<Products />} />

        <Route path="/info1" element={<Info1 />} />

        {/* Corrected Room Management Routes */}
        <Route path="/rooms/home" element={<RoomHome />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/Transactionreports" element={<TransactionReport />} />
        <Route path="/Stockreports" element={<StockReport />} />
        <Route path="/Checkout" element={<CheckoutPage />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />

      </Routes>
    </Router>
  </StrictMode>
);