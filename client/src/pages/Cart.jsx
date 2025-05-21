import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header'; // Import Header
import styles from './Cart.module.css';
import { useCart } from '../contexts/CartContext'; // Đúngart

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Giá trị mặc định là []
  const [selectedItems, setSelectedItems] = useState([]); // State mới để theo dõi items được chọn
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user'); // Check if user is logged in
  const { updateCartCount, fetchCartCount } = useCart(); // Thêm fetchCartCount

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchCart();
    fetchCartCount(); // Cập nhật số lượng khi component mount
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.cart) {
        const formattedCart = data.cart.map(item => ({
          ...item,
          price: Number(item.price.replace(/[^\d]/g, '')),
        }));
        setCartItems(formattedCart);
        // Cập nhật số lượng loại sản phẩm
        updateCartCount(formattedCart.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const increaseQuantity = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }
  
    try {
      // Cập nhật UI ngay lập tức
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );

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
      // Cập nhật lại state với dữ liệu từ server
      const formattedCart = data.cart.map(item => ({
        ...item,
        price: Number(item.price.replace(/[^\d]/g, ''))
      }));
      setCartItems(formattedCart);
      
    } catch (error) {
      console.error(error.message);
      // Rollback UI nếu có lỗi
      await fetchCart();
    }
  };
  
  const decreaseQuantity = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }

    try {
      // Tìm sản phẩm trong giỏ hàng
      const item = cartItems.find(item => item.id === id);
      if (!item) return;

      // Cập nhật UI tạm thời
      if (item.quantity === 1) {
        // Nếu số lượng = 1, xóa sản phẩm
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      } else {
        // Giảm số lượng
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }

      const response = await fetch('http://localhost:5000/api/cart/decrease', {
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
      // Cập nhật lại state với dữ liệu từ server để đảm bảo đồng bộ
      if (data.cart) {
        const formattedCart = data.cart.map(item => ({
          ...item,
          price: Number(item.price.replace(/[^\d]/g, ''))
        }));
        setCartItems(formattedCart);
      }

    } catch (error) {
      console.error('Error decreasing quantity:', error);
      // Nếu có lỗi, fetch lại toàn bộ giỏ hàng để đồng bộ
      await fetchCart();
    }
  };
  
  const removeItem = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      return;
    }
  
    try {
      // Cập nhật UI tạm thời
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi xóa sản phẩm');
      }
  
      const data = await response.json();
      if (data.success) {
        // Cập nhật lại state với dữ liệu từ server
        const formattedCart = data.cart.map(item => ({
          ...item,
          price: Number(item.price.replace(/[^\d]/g, ''))
        }));
        setCartItems(formattedCart);
        // Cập nhật số lượng loại sản phẩm trong giỏ hàng
        updateCartCount(formattedCart.length);
      }
  
    } catch (error) {
      console.error('Error removing item:', error);
      // Rollback nếu có lỗi
      await fetchCart();
    }
  };
  
  // Hàm xử lý chọn/bỏ chọn từng sản phẩm
  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  // Hàm xử lý chọn/bỏ chọn tất cả sản phẩm
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Tính tổng tiền của các sản phẩm được chọn
  const calculateSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Chuyển đến trang thanh toán với các sản phẩm đã chọn
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để đặt hàng');
      return;
    }
    // Lấy ra những sản phẩm đã được chọn 
    const selectedProducts = cartItems.filter(item => selectedItems.includes(item.id));
    navigate('/checkout', { state: { products: selectedProducts } });
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
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const total = Number(item.price) * Number(item.quantity);
                  return (
                    <tr key={item.id} style={{ animation: 'fadeIn 0.5s ease' }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td>
                        <img src={item.img} alt={item.name} className={styles.cartImage} />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.price.toLocaleString('vi-VN')} ₫</td>
                      <td>
                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                      </td>
                      <td>{total.toLocaleString('vi-VN')} ₫</td>
                      <td>
                        <button onClick={() => removeItem(item.id)}>Xóa</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.cartSummary}>
              <p>Đã chọn: {selectedItems.length} sản phẩm</p>
              <p className={styles.totalPrice}>
                Tổng tiền: {calculateSelectedTotal().toLocaleString('vi-VN')} VND
              </p>
              <button
                className={styles.checkoutButton}
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
              >
                Tiến hành đặt hàng
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
