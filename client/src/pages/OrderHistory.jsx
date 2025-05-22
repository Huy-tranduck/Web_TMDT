import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import styles from './OrderHistory.module.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      // Thêm endpoint để lấy thông tin user
      const [ordersResponse, userResponse] = await Promise.all([
        fetch('http://localhost:5000/api/orders/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      const [ordersData, userData] = await Promise.all([
        ordersResponse.json(),
        userResponse.json()
      ]);
      
      if (ordersData.success) {
        setOrders(ordersData.orders.map(order => ({
          ...order,
          userInfo: userData.user // Thêm thông tin user vào mỗi order
        })));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang chuẩn bị',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy',
      'completed': 'Hoàn thành',
      'returned': 'Đã hoàn trả'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffa500',
      'confirmed': '#007bff',
      'processing': '#17a2b8',
      'shipping': '#28a745',
      'delivered': '#28a745',
      'cancelled': '#dc3545',
      'completed': '#28a745',
      'returned': '#6c757d'
    };
    return colors[status] || '#666';
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <>
      <Header />
      <div className={styles.orderHistory}>
        <h1>Đơn mua</h1>
        {loading ? (
          <div>Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map(order => (
              <div 
                key={order._id} 
                className={styles.orderCard}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
              >
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>Đơn hàng #{order._id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className={styles.productList}>
                  {order.products.map(product => (
                    <div key={product._id} className={styles.productItem}>
                      <img src={product.img} alt={product.name} />
                      <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <p>Số lượng: {product.quantity}</p>
                        <p>{product.price.toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.totalAmount}>
                    <span>Tổng tiền:</span>
                    <span>{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Chi tiết đơn hàng #{selectedOrder._id}</h2>
            
            <div className={styles.deliveryInfo}>
              <h3>Thông tin giao hàng</h3>
              <p><strong>Người nhận:</strong> {selectedOrder.userInfo?.fullName || 'N/A'}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.userInfo?.phone || 'N/A'}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.shippingInfo?.address}</p>
              <p><strong>Phương thức vận chuyển:</strong> {selectedOrder.shippingMethod}</p>
              {selectedOrder.trackingNumber && (
                <p><strong>Mã vận đơn:</strong> {selectedOrder.trackingNumber}</p>
              )}
            </div>

            <div className={styles.orderProducts}>
              <h3>Sản phẩm đã mua</h3>
              <div className={styles.productsList}>
                {selectedOrder.products.map(product => (
                  <div key={product._id} className={styles.productRow}>
                    <img src={product.img} alt={product.name} />
                    <div className={styles.productDetails}>
                      <h4>{product.name}</h4>
                      <p>Số lượng: {product.quantity}</p>
                      <p>Đơn giá: {product.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div className={styles.productTotal}>
                      {(product.price * product.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.paymentInfo}>
              <h3>Thông tin thanh toán</h3>
              <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod}</p>
              <p><strong>Tổng tiền hàng:</strong> {selectedOrder.subtotal?.toLocaleString('vi-VN')}₫</p>
              <p><strong>Phí vận chuyển:</strong> {selectedOrder.shippingFee?.toLocaleString('vi-VN')}₫</p>
              {selectedOrder.discount > 0 && (
                <p><strong>Giảm giá:</strong> -{selectedOrder.discount?.toLocaleString('vi-VN')}₫</p>
              )}
              <p className={styles.totalPrice}>
                <strong>Tổng cộng:</strong> {selectedOrder.totalAmount?.toLocaleString('vi-VN')}₫
              </p>
            </div>

            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
