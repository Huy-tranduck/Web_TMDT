import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm từ localStorage khi component được mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Tính tổng giá
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Xử lý tăng số lượng sản phẩm
  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xử lý giảm số lượng sản phẩm
  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    alert('Thanh toán thành công!');
    localStorage.removeItem('cart');
    setCartItems([]);
    navigate('/');
  };

  return (
    <div className={styles.cartContainer}>
      <h1>Giỏ hàng</h1>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.cartImage} />
                <div className={styles.cartDetails}>
                  <h3>{item.name}</h3>
                  <p>Giá: {item.price.toLocaleString('vi-VN')} VND</p>
                  <p>Số lượng: {item.quantity}</p>
                  <div className={styles.cartActions}>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <button onClick={() => removeItem(item.id)}>Xóa</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h2>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND</h2>
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Thanh toán
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
