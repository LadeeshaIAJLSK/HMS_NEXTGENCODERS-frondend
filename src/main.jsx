import React from 'react'; // Add this line
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products.jsx";
import RoomHome from "./pages/Departments/Owner/OwnRooms/RoomHome";
import CreateRooms from "./pages/Departments/Owner/OwnRooms/CreateRooms";
import EditRooms from "./pages/Departments/Owner/OwnRooms/EditRooms";
import RoomDetails from "./pages/Departments/Owner/OwnRooms/RoomDetails";
import Ownsidebar from "./components/owner/ownSidebar/Ownsidebar.jsx";
import "./pages/Departments/Owner/OwnRooms/OwnRooms.css";

// import SettingsPage from "../Pages/Setting";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <div className="app-container">
        <Ownsidebar />
        <div className="main-content">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/restaurant/categories" element={<ResCategories />} />
        <Route path="/restaurant/products" element={<Products />} />
        <Route path="/" element={<Navigate replace to="/rooms/home" />} /> {/* Redirect "/" to "/rooms" */}
        <Route path="/rooms/home" element={<RoomHome />} />
        <Route path="/add" element={<CreateRooms />} />
        <Route path="/edit/:id" element={<EditRooms />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="*" element={<Navigate replace to="/rooms/home" />} /> {/* Redirect unknown routes to "/rooms" */}
      </Routes>
      </div></div>
    </Router>
  </StrictMode>
);