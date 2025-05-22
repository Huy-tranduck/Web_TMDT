import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AdminLayout.module.css';

// Import các components
import Dashboard from '../admin/Dashboard';
import ProductManager from '../admin/ProductManager';
import OrderManager from '../admin/OrderManager';
import UserManager from '../admin/UserManager';
import VoucherManager from '../admin/VoucherManager';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Admin Panel</div>
        <nav>
          <ul>
            <li className={location.pathname === '/admin/dashboard' ? styles.active : ''}>
              <Link to="/admin/dashboard">
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={location.pathname === '/admin/products' ? styles.active : ''}>
              <Link to="/admin/products">
                <i className="fas fa-box"></i>
                <span>Sản phẩm</span>
              </Link>
            </li>
            <li className={location.pathname === '/admin/orders' ? styles.active : ''}>
              <Link to="/admin/orders">
                <i className="fas fa-shopping-cart"></i>
                <span>Đơn hàng</span>
              </Link>
            </li>
            <li className={location.pathname === '/admin/users' ? styles.active : ''}>
              <Link to="/admin/users">
                <i className="fas fa-users"></i>
                <span>Người dùng</span>
              </Link>
            </li>
            <li className={location.pathname === '/admin/vouchers' ? styles.active : ''}>
              <Link to="/admin/vouchers">
                <i className="fas fa-ticket-alt"></i>
                <span>Quản lý Voucher</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Quản trị hệ thống</h1>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <i className="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </header>

        <div className={styles.content}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="vouchers" element={<VoucherManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
