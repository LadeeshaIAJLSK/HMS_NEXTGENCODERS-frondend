import React from 'react'; // Add this line
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products";

import RoomHome from "./pages/Departments/Owner/OwnRooms/RoomHome.jsx";
import CreateRooms from "./pages/Departments/Owner/OwnRooms/CreateRooms";
import EditRooms from "./pages/Departments/Owner/OwnRooms/EditRooms";
import RoomDetails from "./pages/Departments/Owner/OwnRooms/RoomDetails"; 
import Info1 from "./pages/Departments/Reception/DOReservations/info1/Info1";
import "./pages/Departments/Owner/OwnRooms/OwnRooms.css";

import SettingsPage from "./pages/Departments/Owner/OwnSettings/OwnSettings.jsx";
import TransactionReport from "./pages/Departments/Owner/OwnReports/Reports.jsx";


// import SettingsPage from "../Pages/Setting";

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
        <Route path="/rooms/add" element={<CreateRooms />} />
        <Route path="/rooms/edit/:id" element={<EditRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<TransactionReport />} />
      </Routes>
    </Router>
  </StrictMode>
);