import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn('⚠️ useCart được gọi bên ngoài CartProvider!');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const addToCart = async (productId) => {
    if (!user) {
      return { success: false, requireLogin: true };
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchCartCount();
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.cart) {
        // Chỉ đếm số loại sản phẩm trong giỏ hàng
        setCartCount(data.cart.length);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]); // Chạy khi user thay đổi

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      addToCart,
      fetchCartCount, // Thêm fetchCartCount vào context
      updateCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};
