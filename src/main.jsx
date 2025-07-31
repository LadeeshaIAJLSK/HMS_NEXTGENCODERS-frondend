


import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import './index.css';

// App Component
import App from './App.jsx';

// Authentication Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HMSHome from "./components/home/HMSHome";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { PackagesProvider } from "./context/PackagesContext";

// Package Components
import Packages from "./components/packages/Packages";
import Cart from "./components/packages/Cart";
import OwnerPackages from "./components/packages/OwnerPackages";
import PackageManagement from "./components/packages/PackageManagement";

// Restaurant Management Components

// Room Management Components
import RoomHome from "./pages/Departments/Owner/OwnRooms/RoomHome.jsx";
import CreateRooms from "./pages/Departments/Owner/OwnRooms/CreateRooms";
import EditRooms from "./pages/Departments/Owner/OwnRooms/EditRooms";
import RoomDetails from "./pages/Departments/Owner/OwnRooms/RoomDetails";

// Owner Management Components
import SettingsPage from "./pages/Departments/Owner/OwnSettings/OwnSettings.jsx";
import TransactionReport from "./pages/Departments/Owner/OwnReports/Reports.jsx";

// Reception Components
import FormSection from './components/reception/Formsection1.jsx';
import Reservation1 from './pages/Departments/Reception/DNReservations/Reservation1.jsx';
import Rooms from './pages/Departments/Reception/Rooms/Rooms.jsx';
import GuestRes from './components/reception/Formedit/GuestRes.jsx';
import EditReservation1 from './pages/Departments/Reception/DNReservations/EditReservation1.jsx';
import DayoutReservationpage from './pages/Departments/Reception/DOReservations/DayoutReservationpage.jsx';
import Recepdashboardpage from './pages/Departments/Reception/Dashboard/Fulldashboard.jsx';

// Dayout Package Components
import CreatePackages from './components/reception/Dayout/CreatePackages.jsx';
import DeletePackages from './components/reception/Dayout/DeletePackages.jsx';
import EditPackages from './components/reception/Dayout/EditPackages.jsx';
import PackageHome from './components/reception/Dayout/PackageHome.jsx';
import DayoutReservation from './components/reception/Dayout/DayoutReservation.jsx';
import Packagespage from './pages/Departments/Reception/DOReservations/packagespage.jsx';

// Initialize QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PackagesProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
            <Router>
              <div className="min-h-screen bg-gray-100">
                <Routes>
                  {/* Authentication Routes */}
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Main App Route */}
                  <Route path="/app" element={<App />} />
                  <Route path="/hms-home" element={<HMSHome />} />

                  {/* Package Routes with Authentication */}
                  <Route
                    path="/packages"
                    element={
                      <ProtectedRoute>
                        <Packages />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/my-packages"
                    element={
                      <ProtectedRoute>
                        <OwnerPackages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/package-management"
                    element={
                      <ProtectedRoute>
                        <PackageManagement />
                      </ProtectedRoute>
                    }
                  />

                  {/* Restaurant Management Routes */}
                  
                 

                  {/* Room Management Routes */}
                  <Route 
                    path="/rooms/home" 
                    element={
                      <ProtectedRoute>
                        <RoomHome />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/rooms/add" 
                    element={
                      <ProtectedRoute>
                        <CreateRooms />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/rooms/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <EditRooms />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/rooms/:id" 
                    element={
                      <ProtectedRoute>
                        <RoomDetails />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Owner Management Routes */}
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <TransactionReport />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Reception Package Management Routes */}
                  <Route 
                    path="/reception-packages" 
                    element={
                      <ProtectedRoute>
                        <PackageHome />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reception-packages/add" 
                    element={
                      <ProtectedRoute>
                        <CreatePackages />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reception-packages/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <EditPackages />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reception-packages/delete/:id" 
                    element={
                      <ProtectedRoute>
                        <DeletePackages />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Reception Routes */}
                  <Route 
                    path="/reception" 
                    element={
                      <ProtectedRoute>
                        <FormSection />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/page1" 
                    element={
                      <ProtectedRoute>
                        <Reservation1 />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reception-rooms" 
                    element={
                      <ProtectedRoute>
                        <Rooms />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/guest" 
                    element={
                      <ProtectedRoute>
                        <GuestRes />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/edit-reservation" 
                    element={
                      <ProtectedRoute>
                        <EditReservation1 />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dayout" 
                    element={
                      <ProtectedRoute>
                        <DayoutReservation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dayout-create" 
                    element={
                      <ProtectedRoute>
                        <DayoutReservationpage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dayout-packages" 
                    element={
                      <ProtectedRoute>
                        <Packagespage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/recepdashboard" 
                    element={
                      <ProtectedRoute>
                        <Recepdashboardpage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Redirect to login if no match */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </Router>
          </SnackbarProvider>
        </PackagesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);