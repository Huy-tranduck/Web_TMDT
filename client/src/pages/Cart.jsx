import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header'; // Import Header
import styles from './Cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Giá trị mặc định là []
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user'); // Check if user is logged in

  useEffect(() => {
    if (!isLoggedIn) return;
  
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      console.log("Token gửi lên:", token); // 👈 kiểm tra token
  
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      setCartItems(data.cart);
    };
  
    fetchCart();
  }, [isLoggedIn]);
  

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const increaseQuantity = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tăng số lượng sản phẩm');
      }
  
      const data = await response.json();
      setCartItems(data.cart); // Cập nhật giỏ hàng từ API
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const decreaseQuantity = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi giảm số lượng sản phẩm');
      }
  
      const data = await response.json();
      setCartItems(data.cart); // Cập nhật giỏ hàng từ API
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const removeItem = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: 0 }), // Xóa sản phẩm bằng cách đặt số lượng = 0
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi xóa sản phẩm');
      }
  
      const data = await response.json();
      setCartItems(data.cart); // Cập nhật giỏ hàng từ API
    } catch (error) {
      console.error(error.message);
    }
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
