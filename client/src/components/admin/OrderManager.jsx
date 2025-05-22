import React, { useState, useEffect } from 'react';
import styles from './OrderManager.module.css';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        alert('Cập nhật trạng thái đơn hàng thành công!');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': '#2196F3',
      'confirmed': '#4CAF50', 
      'processing': '#FF9800',
      'delivered': '#4CAF50',
      'cancelled': '#F44336',
      'returned': '#9C27B0'
    };
    return colors[status] || '#666';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'new': 'Mới',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy',
      'returned': 'Hoàn trả'
    };
    return labels[status] || status;
  };

  const filteredOrders = Array.isArray(orders) ? 
    (filterStatus === 'all' ? orders : orders.filter(order => order.status === filterStatus)) 
    : [];

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.orderManager}>
      <div className={styles.header}>
        <h2>Quản lý đơn hàng</h2>
        <div className={styles.filters}>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả đơn hàng</option>
            <option value="new">Đơn hàng mới</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
            <option value="returned">Hoàn trả</option>
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId || 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>{order.totalAmount?.toLocaleString('vi-VN')}₫</td>
                <td>
                  <span 
                    className={styles.statusBadge}
                    style={{backgroundColor: getStatusColor(order.status)}}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                    className={styles.viewButton}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {order.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(order._id, 'confirmed')}
                        className={styles.approveButton}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order._id, 'cancelled')}
                        className={styles.cancelButton}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{textAlign: 'center'}}>
                Không có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDetails && selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Chi tiết đơn hàng #{selectedOrder._id}</h3>
            
            <div className={styles.orderInfo}>
              <div className={styles.customerInfo}>
                <h4>Thông tin người nhận</h4>
                <p><strong>Người nhận:</strong> {selectedOrder.shippingInfo?.recipientName}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.shippingInfo?.phone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingInfo?.address}</p>
              </div>

              <div className={styles.orderDetails}>
                <h4>Thông tin đơn hàng</h4>
                <p><strong>Phương thức vận chuyển:</strong> {selectedOrder.shippingMethod}</p>
                <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                {selectedOrder.voucher && (
                  <p><strong>Mã giảm giá:</strong> {selectedOrder.voucher}</p>
                )}
              </div>
            </div>

            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className={styles.productInfo}>
                        <img src={product.img} alt={product.name} />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.quantity}</td>
                    <td>{product.price.toLocaleString('vi-VN')}₫</td>
                    <td>{(product.price * product.quantity).toLocaleString('vi-VN')}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.orderSummary}>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Tổng cộng:</span>
                <span>{selectedOrder.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <button onClick={() => setShowDetails(false)} className={styles.closeButton}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
