<<<<<<< HEAD
import { useState } from 'react'
import './App.css'
import {Link} from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HMSHome from "./components/home/HMSHome";
import { AuthProvider } from "./context/AuthContext";
import { PackagesProvider } from "./context/PackagesContext";
import Packages from "./components/packages/Packages";
import Cart from "./components/packages/Cart";
import OwnerPackages from "./components/packages/OwnerPackages";
import PackageManagement from "./components/packages/PackageManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";

>>>>>>> origin/Newdev_abdul

function App() {
  const queryClient = new QueryClient();
  return (
<<<<<<< HEAD
    <div>
      <Link to='/restaurant/categories'>click here to go to category page</Link>
      <br></br>
      <Link to='/restaurant/products'>click here to go to products page</Link>
      <br/><br/>
      
      <Link to="/dashboard">Owner Dashboard</Link>
      <br/>
      <Link to="/rooms/home">Go to Room Management Home</Link>
      <br />  
      <Link to="/settings">Settings</Link>
      <br/>
      <Link to="/Transactionreports">TransactionReports</Link>
      <br/>
      <Link to="/Stockreports">StockReports</Link>
      <br/>
      <Link to="/Checkout">Checkout Details</Link>
      <br/><br/>

      <Link to="/info1">Click here to go to Info1 page</Link>



    </div>
  )
=======
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PackagesProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
            <Router>
              <div className="min-h-screen bg-gray-100">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/hms-home" element={<HMSHome />} />
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
                </Routes>
              </div>
            </Router>
          </SnackbarProvider>
        </PackagesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
>>>>>>> origin/Newdev_abdul
}

export default App;
