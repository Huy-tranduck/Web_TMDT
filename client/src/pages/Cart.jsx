import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header'; // Import Header
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user'); // Check if user is logged in

  useEffect(() => {
    if (!isLoggedIn) return; // Skip fetching cart if not logged in
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [isLoggedIn]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    alert('Thanh toán thành công!');
    localStorage.removeItem('cart');
    setCartItems([]);
    navigate('/');
  };

  return (
    <>
      <Header /> {/* Sử dụng Header chung */}
      <div className={styles.cartContainer}>
        <h1>Giỏ hàng</h1>
        {!isLoggedIn ? (
          <p className={styles.cartEmpty}>Bạn cần đăng nhập để sử dụng giỏ hàng.</p>
        ) : cartItems.length === 0 ? (
          <p className={styles.cartEmpty}>Giỏ hàng của bạn đang trống.</p>
        ) : (
          <>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} style={{ animation: 'fadeIn 0.5s ease' }}>
                    <td>
                      <img src={item.image} alt={item.name} className={styles.cartImage} />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price.toLocaleString('vi-VN')} VND</td>
                    <td>
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </td>
                    <td>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
                    <td>
                      <button onClick={() => removeItem(item.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className={styles.totalSummary}>
              Tổng số mặt hàng: <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </h2>
            <h2 className={styles.totalPrice}>
              Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND
            </h2>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Thanh toán
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
