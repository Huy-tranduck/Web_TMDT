import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
            <li>
              <Link to="/admin/dashboard">
                <i className="fas fa-home"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products">
                <i className="fas fa-mobile-alt"></i> Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/admin/orders">
                <i className="fas fa-shopping-cart"></i> Đơn hàng
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <i className="fas fa-users"></i> Người dùng
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
            <Route path="dashboard" element={<div>Dashboard Content</div>} />
            <Route path="products" element={<div>Products Management</div>} />
            <Route path="orders" element={<div>Orders Management</div>} />
            <Route path="users" element={<div>Users Management</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
