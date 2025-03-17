import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Info1 from "./pages/Departments/Reception/DOReservations/info1/Info1";
import Info2 from "./pages/Departments/Reception/DOReservations/info2/info2";






createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      
        <Route path="/info1" element={<Info1 />} />
        <Route path="/info2" element={<Info2 />} />
        
      </Routes>
    </Router>
  </StrictMode>
);

