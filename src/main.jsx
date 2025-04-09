

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

import "./pages/Departments/Owner/OwnRooms/OwnRooms.css";
import Info1 from "./pages/Departments/Reception/DOReservations/info1/Info1";
import Info2 from './pages/Departments/Reception/DOReservations/info2/Info2.jsx';
import Sidebar from "./components/reception/recSidebar/Recsidebar";
import CheckInForm from './components/reception/CheckInForm/CheckInForm.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/info1" element={<Info1 />} />
        <Route path="/info2" element={<Info2 />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/checkin" element={<CheckInForm />} />
       
        

        <Route path="/restaurant/categories" element={<ResCategories />} />
        <Route path="/restaurant/products" element={<Products />} />

        

        {/* Corrected Room Management Routes */}
        <Route path="/rooms/home" element={<RoomHome />} />
        <Route path="/rooms/add" element={<CreateRooms />} />
        <Route path="/rooms/edit/:id" element={<EditRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />

      </Routes>
    </Router>
  </StrictMode>
);