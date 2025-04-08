import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((count, item) => count + item.quantity, 0));
  }, []);

  const addToCart = (product) => {
    const isLoggedIn = localStorage.getItem('user'); // Check if user is logged in
    if (!isLoggedIn) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }

    const updatedCart = [...cartItems];
    const existingProduct = updatedCart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCartItems(updatedCart);
    setCartCount((prevCount) => prevCount + 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
