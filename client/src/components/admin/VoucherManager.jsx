import React, { useState, useEffect } from 'react';
import styles from './VoucherManager.module.css';

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    description: '',
    discountAmount: 0,
    minSpend: 0,
    startDate: '',
    endDate: '',
    quantity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/vouchers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      // Kiểm tra dữ liệu trả về
      if (response.ok && data.success) {
        setVouchers(data.vouchers || []); // Đảm bảo luôn có một mảng, ngay cả khi rỗng
      } else {
        throw new Error(data.message || 'Không thể lấy danh sách voucher');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setVouchers([]); // Set mảng rỗng nếu có lỗi
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/vouchers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVoucher)
      });

      if (response.ok) {
        fetchVouchers();
        setShowAddForm(false);
        setNewVoucher({
          code: '',
          description: '',
          discountAmount: 0,
          minSpend: 0,
          startDate: '',
          endDate: '',
          quantity: 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.voucherManager}>
      <div className={styles.header}>
        <h2>Quản lý Voucher</h2>
        <button onClick={() => setShowAddForm(true)}>
          <i className="fas fa-plus"></i> Thêm Voucher
        </button>
      </div>

      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Thêm Voucher mới</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Mã voucher</label>
                <input
                  type="text"
                  required
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả</label>
                <textarea
                  value={newVoucher.description}
                  onChange={(e) => setNewVoucher({...newVoucher, description: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số tiền giảm</label>
                <input
                  type="number"
                  required
                  value={newVoucher.discountAmount}
                  onChange={(e) => setNewVoucher({...newVoucher, discountAmount: Number(e.target.value)})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Đơn hàng tối thiểu</label>
                <input
                  type="number"
                  required
                  value={newVoucher.minSpend}
                  onChange={(e) => setNewVoucher({...newVoucher, minSpend: Number(e.target.value)})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  required
                  value={newVoucher.startDate}
                  onChange={(e) => setNewVoucher({...newVoucher, startDate: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ngày kết thúc</label>
                <input
                  type="datetime-local"
                  required
                  value={newVoucher.endDate}
                  onChange={(e) => setNewVoucher({...newVoucher, endDate: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số lượng</label>
                <input
                  type="number"
                  required
                  value={newVoucher.quantity}
                  onChange={(e) => setNewVoucher({...newVoucher, quantity: Number(e.target.value)})}
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddForm(false)}>Hủy</button>
                <button type="submit">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className={styles.voucherTable}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Mô tả</th>
            <th>Giảm giá</th>
            <th>Đơn tối thiểu</th>
            <th>Thời gian</th>
            <th>Số lượng</th>
            <th>Đã dùng</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(vouchers) && vouchers.length > 0 ? (
            vouchers.map(voucher => (
              <tr key={voucher._id}>
                <td>{voucher.code}</td>
                <td>{voucher.description}</td>
                <td>{voucher.discountAmount.toLocaleString('vi-VN')}₫</td>
                <td>{voucher.minSpend.toLocaleString('vi-VN')}₫</td>
                <td>
                  {new Date(voucher.startDate).toLocaleDateString()} -
                  {new Date(voucher.endDate).toLocaleDateString()}
                </td>
                <td>{voucher.quantity}</td>
                <td>{voucher.usedCount}</td>
                <td>
                  <span className={voucher.isActive ? styles.active : styles.inactive}>
                    {voucher.isActive ? 'Hoạt động' : 'Hết hạn'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button><i className="fas fa-edit"></i></button>
                  <button><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{textAlign: 'center'}}>
                {loading ? 'Đang tải...' : 'Không có voucher nào'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherManager;
