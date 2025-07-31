import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const PackagesContext = createContext();

export const usePackages = () => {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
};

export const PackagesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [packages, setPackages] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [ownerPackages, setOwnerPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios base URL - adjust this to match your backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Configure axios instance with interceptors
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      // Skip if not needed or if there's no backend
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching packages from:', `${API_BASE_URL}/api/packages`);
        
        // Try to fetch from backend, fall back to mock data if needed
        const response = await api.get('/api/packages'); // Changed from /api/user/packages
        
        console.log('Raw response:', response);
        
        if (response.data && response.data.success) {
          setPackages(response.data.packages || []);
        } else if (response.data && Array.isArray(response.data)) {
          // Handle case where backend returns array directly
          setPackages(response.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch packages');
        }
        
        console.log('Packages loaded successfully');
        
      } catch (error) {
        console.error('Error fetching packages:', error);
        
        // Better error handling
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.message;
          
          switch (status) {
            case 404:
              setError('Packages endpoint not found. The API might not be configured correctly.');
              break;
            case 500:
              setError('Server error occurred. Please check your backend server and database connection.');
              break;
            case 401:
              setError('Authentication required. Please login again.');
              break;
            case 403:
              setError('Access denied. You do not have permission to view packages.');
              break;
            default:
              setError(`Server error (${status}): ${message}`);
          }
        } else if (error.request) {
          setError('Cannot connect to server. Please check if your backend server is running and accessible.');
        } else {
          setError(`Request failed: ${error.message}`);
        }
        
        // Set empty packages on error to prevent app crash
        setPackages([]);
        
        // TEMPORARY: Use mock data for development/testing
        console.warn('Using mock packages data due to backend error');
        setPackages([
          {
            id: 1,
            name: 'Basic Package',
            description: 'Basic hotel management features',
            price: 99.99,
            features: ['Room Management', 'Basic Reporting']
          },
          {
            id: 2,
            name: 'Premium Package',
            description: 'Advanced hotel management features',
            price: 199.99,
            features: ['Room Management', 'Advanced Reporting', 'Restaurant Integration']
          }
        ]);
        
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [isAuthenticated]); // Only depend on authentication status

  // Fetch owner's purchased packages (commented out as in original)
  // useEffect(() => {
  //   const fetchOwnerPackages = async () => {
  //     if (!isAuthenticated) return;
  //     
  //     try {
  //       setLoading(true);
  //       const response = await api.get('/api/user/owner-packages');
  //       if (response.data.success) {
  //         setOwnerPackages(response.data.packages);
  //       } else {
  //         throw new Error(response.data.message || 'Failed to fetch owner packages');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching owner packages:', error);
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchOwnerPackages();
  // }, [isAuthenticated]);

  // Fetch cart from backend if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchCart = async () => {
        try {
          const response = await api.get(`/api/cart?userId=${user._id}`); // Changed from /api/user/cart
          if (response.data && response.data.success) {
            setCart(response.data.cart || []);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          // Don't set error state for cart fetch failures, just log them
        }
      };
      
      fetchCart();
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // Add to cart function (improved error handling)
  const addToCart = async (packageItem) => {
    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === packageItem.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === packageItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { ...packageItem, quantity: 1 }];
      });
      
      // Optionally, send to backend if authenticated
      if (isAuthenticated && user) {
        try {
          await api.post('/api/cart/add', { // Changed from /api/user/add-to-cart
            userId: user._id,
            packageId: packageItem.id,
            quantity: 1
          });
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
          // Don't throw error, allow local cart to work
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (packageId) => {
    try {
      setCart(prevCart => prevCart.filter(item => item.id !== packageId));
      
      if (isAuthenticated && user) {
        try {
          await api.post('/api/cart/remove', { // Changed from /api/user/remove-from-cart
            userId: user._id,
            packageId
          });
        } catch (error) {
          console.error('Failed to sync cart removal with backend:', error);
          // Don't throw error, allow local cart to work
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  };

  const purchasePackages = async () => {
    try {
      // Simulate successful payment and package purchase
      const purchasedPackages = cart.map(item => ({
        ...item,
        status: 'active',
        purchaseDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year subscription
      }));

      // Update owner packages in state
      setOwnerPackages(prevPackages => [...prevPackages, ...purchasedPackages]);

      // Clear the cart in state
      setCart([]);

      // Clear the cart in localStorage for guests
      if (!isAuthenticated) {
        localStorage.removeItem('cart');
      }

      // Clear the cart in backend for authenticated users
      if (isAuthenticated && user) {
        try {
          await api.post('/api/cart/clear', { // Changed from /api/user/clear-cart
            userId: user._id
          });
        } catch (error) {
          console.error('Failed to clear cart on backend:', error);
          // Don't throw error, purchase was successful locally
        }
      }

      return true;
    } catch (error) {
      console.error('Error purchasing packages:', error);
      throw new Error('Failed to purchase packages');
    }
  };

  // Retry function for failed requests
  const retryFetchPackages = () => {
    setError(null);
    // Re-trigger the useEffect by changing a dependency or call fetchPackages directly
    window.location.reload(); // Simple approach, could be improved
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    packages,
    cart,
    ownerPackages,
    loading,
    error,
    addToCart,
    removeFromCart,
    purchasePackages,
    retryFetchPackages,
    clearError
  };

  return (
    <PackagesContext.Provider value={value}>
      {children}
    </PackagesContext.Provider>
  );
};