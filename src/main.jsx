


import React from 'react'; // Add this line
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';



//owner goes here
import RoomHomepage from './pages/Departments/Owner/OwnRooms/RoomHomepage.jsx';
import OwnsettingsPage from './pages/Departments/Owner/OwnSettings/Ownsettingpage.jsx';
import TransactionReportpage from "./pages/Departments/Owner/OwnReports/TransactionReportpage.jsx";
import StockReportpage from "./pages/Departments/Owner/OwnReports/Stockreportpage.jsx";
import CheckoutPage from "./pages/Departments/Owner/OwnReports/Checkoutpage.jsx";
import OwnDashboardpage from './pages/Departments/Owner/OwnDashboard/OwnDashboardpage.jsx';



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
        

        {/*owner Routes */}
        <Route path="/rooms/home" element={<RoomHomepage />} />
        <Route path="/ownsettings" element={<OwnsettingsPage />} />
        <Route path="/Transactionreportspage" element={<TransactionReportpage />} />
        <Route path="/Stockreportspage" element={<StockReportpage />} />
        <Route path="/Checkoutpage" element={<CheckoutPage />} />
        <Route path="/ownedashboardpg" element={<OwnDashboardpage />} />


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
        
        {/* Restaurant Routes */}

        
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





