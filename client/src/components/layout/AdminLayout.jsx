import React from 'react';
import { Outlet, NavLink, Routes, Route } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import Dashboard from '../admin/Dashboard';
import UserManager from '../admin/UserManager';
import ProductManager from '../admin/ProductManager';
import OrderManager from '../admin/OrderManager';
import BannerManager from '../admin/BannerManager'; // Thêm import này

const AdminLayout = () => {
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
          </ul>
        </nav>
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManager />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="banners" element={<BannerManager />} /> {/* Thêm route Banner */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
