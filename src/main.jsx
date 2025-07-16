

import React from 'react'; // Add this line
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ResCategories from "./pages/Departments/Restaurant/Categories/ResCategories.jsx";
import Products from "./pages/Departments/Restaurant/Products/Products";


//owner goes here
import RoomHome from "./pages/Departments/Owner/OwnRooms/RoomHome.jsx";
import SettingsPage from "./pages/Departments/Owner/OwnSettings/OwnSettings.jsx";
import TransactionReport from "./pages/Departments/Owner/OwnReports/TransactionReports.jsx";
import StockReport from "./pages/Departments/Owner/OwnReports/StockRepo.jsx";
import CheckoutPage from "./pages/Departments/Owner/OwnReports/Checkout.jsx";
import OwnerDashboard from "./pages/Departments/Owner/OwnDashboard/OwnDashboard.jsx"



//reception goes here
import FormSection from './components/reception/Formsection1.jsx';
import Reservation1 from './pages/Departments/Reception/DNReservations/Reservation1.jsx';
import Rooms from './pages/Departments/Reception/Rooms/Rooms.jsx';
import GuestRes from './components/reception/Formedit/GuestRes.jsx';
import Fulldashboard from './pages/Departments/Reception/Dashboard/Fulldashboard.jsx';
import EditReservation1 from './pages/Departments/Reception/DNReservations/EditReservation1.jsx';



import CreatePackages from './components/reception/Dayout/CreatePackages.jsx';
import DeletePackages from './components/reception/Dayout/DeletePackages.jsx';
import EditPackages from './components/reception/Dayout/EditPackages.jsx';
import PackageHome from './components/reception/Dayout/PackageHome.jsx';
import HotelDash from './components/reception/Dashboard/HotelDash.jsx';








createRoot(document.getElementById('root')).render(
   <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        

        {/*owner Routes */}
        <Route path="/rooms/home" element={<RoomHome />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/Transactionreports" element={<TransactionReport />} />
        <Route path="/Stockreports" element={<StockReport />} />
        <Route path="/Checkout" element={<CheckoutPage />} />
        <Route path="/dashboardowner" element={<OwnerDashboard />} />


           {/* Reception Routes */}

            {/* Package Management Routes */}
                <Route path="/packages" element={<PackageHome />} />
                <Route path="/packages/add" element={<CreatePackages />} />
                <Route path="/packages/edit/:id" element={<EditPackages />} />
                <Route path="/packages/delete/:id" element={<DeletePackages />} />


        {/* Reception Routes */}
        <Route path="/reception" element={<FormSection />} />
        <Route path="/page1"  element={<Reservation1 />} />
        <Route path="/rooms" element={<Rooms/>} />
        <Route path="/guest" element={<GuestRes />} />
        <Route path="/dashboardreception" element={<Fulldashboard />} />
        <Route path="/edit-reservation" element={<EditReservation1 />} /> {/* Route for EditReservation1 component */}
        <Route path="/hdash" element={<HotelDash />} />
        

      </Routes>
    </Router>
  </StrictMode>
);




