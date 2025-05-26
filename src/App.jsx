import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HMSHome from './components/home/HMSHome';
import { AuthProvider } from './context/AuthContext';
import { PackagesProvider } from './context/PackagesContext';
import Packages from './components/packages/Packages';
import Cart from './components/packages/Cart';
import OwnerPackages from './components/packages/OwnerPackages';
import PackageManagement from './components/packages/PackageManagement';

function App() {
  return (
    <AuthProvider>
      <PackagesProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
              path="/hms-home"
               element={
               <ProtectedRoute>
                <HMSHome />
                </ProtectedRoute>
              }
               />
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
      </PackagesProvider>
    </AuthProvider>
  );
}

export default App; 