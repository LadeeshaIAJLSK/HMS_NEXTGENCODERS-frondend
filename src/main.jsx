import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products";
import Info1 from "./pages/Departments/Reception/DOReservations/info1/Info1";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/restaurant/categories" element={<ResCategories />} />
        <Route path="/restaurant/products" element={<Products />} />
        <Route path="/info1" element={<Info1 />} />
        
      </Routes>
    </Router>
  </StrictMode>
);
