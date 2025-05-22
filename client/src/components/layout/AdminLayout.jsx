import React from 'react';
import { Outlet, NavLink, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Thêm import này
import styles from './AdminLayout.module.css';
import Dashboard from '../admin/Dashboard';
import UserManager from '../admin/UserManager';
import ProductManager from '../admin/ProductManager';
import OrderManager from '../admin/OrderManager';
import BannerManager from '../admin/BannerManager';
import VoucherManager from '../admin/VoucherManager';

const AdminLayout = () => {
  const location = useLocation(); // Sử dụng hook useLocation
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
  };

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <NavLink to="/">TMDT Admin</NavLink>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? styles.active : ''}>
                <i className="fas fa-users"></i> Quản lý người dùng
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={({ isActive }) => isActive ? styles.active : ''}>
                <i className="fas fa-box"></i> Quản lý sản phẩm
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={({ isActive }) => isActive ? styles.active : ''}>
                <i className="fas fa-shopping-cart"></i> Quản lý đơn hàng
              </NavLink>
            </li>
            {/* Thêm menu Banner */}
            <li>
              <NavLink to="/admin/banners" className={({ isActive }) => isActive ? styles.active : ''}>
                <i className="fas fa-images"></i> Quản lý banner
              </NavLink>
            </li>
            <li className={location.pathname === '/admin/vouchers' ? styles.active : ''}>
              <Link to="/admin/vouchers">
                <i className="fas fa-ticket-alt"></i>
                <span>Quản lý Voucher</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

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
            <Route path="banners" element={<BannerManager />} />
            <Route path="vouchers" element={<VoucherManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
