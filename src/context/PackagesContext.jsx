import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PackagesContext = createContext();

export const usePackages = () => {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
};

export const PackagesProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [cart, setCart] = useState([]);
  const [ownerPackages, setOwnerPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/packages');
        if (response.data.success) {
          setPackages(response.data.packages);
        } else {
          throw new Error(response.data.message || 'Failed to fetch packages');
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Fetch owner's purchased packages
  useEffect(() => {
    const fetchOwnerPackages = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/owner-packages');
        if (response.data.success) {
          setOwnerPackages(response.data.packages);
        } else {
          throw new Error(response.data.message || 'Failed to fetch owner packages');
        }
      } catch (error) {
        console.error('Error fetching owner packages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerPackages();
  }, []);

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
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (packageId) => {
    try {
      setCart(prevCart => prevCart.filter(item => item.id !== packageId));
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
      
      // Clear the cart
      setCart([]);
      
      return true;
    } catch (error) {
      console.error('Error purchasing packages:', error);
      throw new Error('Failed to purchase packages');
    }
  };

  const value = {
    packages,
    cart,
    ownerPackages,
    loading,
    error,
    addToCart,
    removeFromCart,
    purchasePackages
  };

  return (
    <PackagesContext.Provider value={value}>
      {children}
    </PackagesContext.Provider>
  );
};