import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Header from '../components/common/Header';
import styles from './Checkout.module.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [selectedProducts] = useState(location.state?.products || []);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucher, setVoucher] = useState('');
  const [voucherError, setVoucherError] = useState('');

  const shippingFees = {
    standard: 30000,
    express: 50000
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = shippingFees[shippingMethod];
    // Thêm logic áp dụng voucher ở đây nếu cần
    return subtotal + shippingFee;
  };

  const handleVoucherSubmit = () => {
    // Thêm logic kiểm tra voucher ở đây
    setVoucherError('Mã giảm giá không hợp lệ');
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        products: selectedProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price,
          name: p.name,
          img: p.img
        })),
        totalAmount: calculateTotal(),
        shippingMethod,
        paymentMethod,
        voucher: voucher || null
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Xóa các sản phẩm đã chọn khỏi giỏ hàng
        const selectedProductIds = selectedProducts.map(p => p.id);
        await fetch('http://localhost:5000/api/cart/selected', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedProductIds }),
        });

        // Cập nhật số lượng giỏ hàng
        updateCartCount(0);
        
        // Chuyển hướng đến trang thành công
        navigate(`/order-success/${data.orderId}`);
      } else {
        throw new Error(data.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      alert('Đặt hàng thất bại: ' + error.message);
    }
  };

  if (!selectedProducts.length) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Header />
      <div className={styles.checkoutContainer}>
        <h1>Thanh toán</h1>

        <div className={styles.orderSummary}>
          <h2>Thông tin đơn hàng</h2>
          <div className={styles.productList}>
            {selectedProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <img src={product.img} alt={product.name} />
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p>Số lượng: {product.quantity}</p>
                  <p>Giá: {product.price.toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.shippingSection}>
          <h2>Phương thức vận chuyển</h2>
          <div className={styles.shippingOptions}>
            <label>
              <input
                type="radio"
                value="standard"
                checked={shippingMethod === 'standard'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              Giao hàng tiêu chuẩn (30.000₫)
            </label>
            <label>
              <input
                type="radio"
                value="express"
                checked={shippingMethod === 'express'}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              Giao hàng nhanh (50.000₫)
            </label>
          </div>
        </div>

        <div className={styles.paymentSection}>
          <h2>Phương thức thanh toán</h2>
          <div className={styles.paymentOptions}>
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label>
              <input
                type="radio"
                value="banking"
                checked={paymentMethod === 'banking'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Chuyển khoản ngân hàng
            </label>
            <label>
              <input
                type="radio"
                value="momo"
                checked={paymentMethod === 'momo'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Ví MoMo
            </label>
          </div>
        </div>

        <div className={styles.voucherSection}>
          <h2>Mã giảm giá</h2>
          <div className={styles.voucherInput}>
            <input
              type="text"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              placeholder="Nhập mã giảm giá"
            />
            <button onClick={handleVoucherSubmit}>Áp dụng</button>
          </div>
          {voucherError && <p className={styles.error}>{voucherError}</p>}
        </div>

        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span>Tạm tính:</span>
            <span>{calculateSubtotal().toLocaleString('vi-VN')}₫</span>
          </div>
          <div className={styles.totalRow}>
            <span>Phí vận chuyển:</span>
            <span>{shippingFees[shippingMethod].toLocaleString('vi-VN')}₫</span>
          </div>
          <div className={styles.totalRow}>
            <span>Tổng cộng:</span>
            <span className={styles.grandTotal}>
              {calculateTotal().toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        <button 
          className={styles.placeOrderButton}
          onClick={handlePlaceOrder}
        >
          Đặt hàng
        </button>
      </div>
    </>
  );
};

export default Checkout;
