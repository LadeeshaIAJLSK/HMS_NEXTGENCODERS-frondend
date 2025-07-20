import React from 'react'; 
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products";
import Analytics from "./pages/Departments/Restaurant/Analytics/Analytics.jsx";

import RoomHome from "./pages/Departments/Owner/OwnRooms/RoomHome.jsx";
import CreateRooms from "./pages/Departments/Owner/OwnRooms/CreateRooms";
import EditRooms from "./pages/Departments/Owner/OwnRooms/EditRooms";
import RoomDetails from "./pages/Departments/Owner/OwnRooms/RoomDetails"; 
import Info1 from "./pages/Departments/Reception/DOReservations/info1/Info1";
import "./pages/Departments/Owner/OwnRooms/OwnRooms.css";
import Login from "./components/restaurant/Login.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import RestaurantPOS from './components/restaurant/RestaurantPOS';
import Dashboard from './pages/Departments/Restaurant/Dashboard/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/restaurant/login" element={<Login />} />
          <Route path="/restaurant/categories" element={<ResCategories />} />
          <Route path="/restaurant/products" element={<Products />} />
          <Route path="/restaurant/create-order" element={<RestaurantPOS />} />
          <Route path="/restaurant/dashboard" element={<Dashboard />} />
          <Route path="/restaurant/analytics" element={<Analytics />} />

          <Route path="/info1" element={<Info1 />} />

          {/* Corrected Room Management Routes */}
          <Route path="/rooms/home" element={<RoomHome />} />
          <Route path="/rooms/add" element={<CreateRooms />} />
          <Route path="/rooms/edit/:id" element={<EditRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);