import React, { useState, useEffect } from 'react';
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
  const [shippingInfo, setShippingInfo] = useState({
    recipientName: '',
    phone: '',
    address: '',
    editable: {
      recipientName: false,
      phone: false
    }
  });
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setShippingInfo(prev => ({
        ...prev,
        recipientName: userInfo.fullName,
        phone: userInfo.phone
      }));
    }
  }, []);

  const toggleEdit = (field) => {
    setShippingInfo(prev => ({
      ...prev,
      editable: {
        ...prev.editable,
        [field]: !prev.editable[field]
      }
    }));
  };

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
    return subtotal + shippingFee;
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleVoucherSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vouchers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code: voucher,
          totalAmount: calculateSubtotal()
        })
      });

      const data = await response.json();

      if (data.success) {
        setVoucherDiscount(data.voucher.discountAmount);
        setVoucherError('');
        showNotification(`Áp dụng mã giảm giá thành công: ${data.voucher.description}`, 'success');
      } else {
        setVoucherDiscount(0);
        setVoucherError(data.message);
        showNotification(data.message, 'error');
      }
    } catch (error) {
      setVoucherError('Lỗi khi kiểm tra mã giảm giá');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập lại để tiếp tục');
        navigate('/login');
        return;
      }

      if (!shippingInfo.recipientName || !shippingInfo.phone || !shippingInfo.address) {
        alert('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }
  
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(shippingInfo.phone)) {
        alert('Số điện thoại không hợp lệ');
        return;
      }
  
      // Di chuyển định nghĩa orderData lên trước khi sử dụng
      const orderData = {
        products: selectedProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price,
          name: p.name,
          img: p.img
        })),
        totalAmount: calculateTotal() - voucherDiscount,
        shippingMethod,
        paymentMethod,
        shippingInfo,
        voucher: voucher || null,
        voucherDiscount
      };
  
      // Tiếp tục với yêu cầu API
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.status === 401) {
        // Token hết hạn
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const data = await response.json();
  
      if (response.ok && data.success) {
        const selectedProductIds = selectedProducts.map(p => p.id);
        await fetch('http://localhost:5000/api/cart/selected', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedProductIds }),
        });
  
        updateCartCount(0);
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
        {notification.show && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            {notification.message}
          </div>
        )}
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
          <h2>Thông tin giao hàng</h2>
          <div className={styles.shippingForm}>
            <div className={styles.formGroup}>
              <div className={styles.formHeader}>
                <label>Người nhận</label>
                <button 
                  type="button" 
                  className={styles.editButton}
                  onClick={() => toggleEdit('recipientName')}
                >
                  {shippingInfo.editable.recipientName ? 'Xong' : 'Thay đổi'}
                </button>
              </div>
              <input
                type="text"
                value={shippingInfo.recipientName}
                onChange={(e) => setShippingInfo({
                  ...shippingInfo,
                  recipientName: e.target.value
                })}
                readOnly={!shippingInfo.editable.recipientName}
                className={!shippingInfo.editable.recipientName ? styles.readOnly : ''}
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.formHeader}>
                <label>Số điện thoại</label>
                <button 
                  type="button" 
                  className={styles.editButton}
                  onClick={() => toggleEdit('phone')}
                >
                  {shippingInfo.editable.phone ? 'Xong' : 'Thay đổi'}
                </button>
              </div>
              <input
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({
                  ...shippingInfo,
                  phone: e.target.value
                })}
                readOnly={!shippingInfo.editable.phone}
                className={!shippingInfo.editable.phone ? styles.readOnly : ''}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ giao hàng *</label>
              <textarea
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({
                  ...shippingInfo,
                  address: e.target.value
                })}
                required
                placeholder="Nhập địa chỉ giao hàng"
              />
            </div>
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
            <label>
              <input
                type="radio"
                value="vnpay"
                checked={paymentMethod === 'vnpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Thanh toán VNPAY
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
            <button onClick={handleVoucherSubmit} disabled={!voucher}>Áp dụng</button>
          </div>
          {voucherError && <p className={styles.error}>{voucherError}</p>}
          {voucherDiscount > 0 && (
            <p className={styles.discountApplied}>
              Giảm giá: -{voucherDiscount.toLocaleString('vi-VN')}₫
            </p>
          )}
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
          {voucherDiscount > 0 && (
            <div className={styles.totalRow}>
              <span>Giảm giá:</span>
              <span>-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
            </div>
          )}
          <div className={styles.totalRow}>
            <span>Tổng cộng:</span>
            <span className={styles.grandTotal}>
              {(calculateTotal() - voucherDiscount).toLocaleString('vi-VN')}₫
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