import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.adminLayout}>
      <nav className={styles.sidebar}>
        <Link to="/admin/dashboard">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/admin/products">
          <i className="fas fa-box"></i>
          <span>Quản lý sản phẩm</span>
        </Link>
        <Link to="/admin/orders">
          <i className="fas fa-shopping-cart"></i>
          <span>Quản lý đơn hàng</span>
        </Link>
        <Link to="/admin/users">
          <i className="fas fa-users"></i>
          <span>Quản lý người dùng</span>
        </Link>
        <Link to="/admin/vouchers">
          <i className="fas fa-ticket-alt"></i>
          <span>Quản lý Voucher</span>
        </Link>
      </nav>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;