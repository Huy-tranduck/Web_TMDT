import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.jpg';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Giả lập lấy số lượng giỏ hàng
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
<<<<<<< HEAD
    setCartCount(cart.length);
=======
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
>>>>>>> 9afb2f6 (Cập nhật code)
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Search Bar */}
<<<<<<< HEAD
        <div className={styles.searchBar}>
          <input type="text" placeholder="Bạn tìm gì..." />
          <button type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
=======
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>
>>>>>>> 9afb2f6 (Cập nhật code)

        {/* User Actions */}
        <div className={styles.userActions}>
          {user ? (
            <div className={styles.userInfo}>
              <span>{user.username}</span>
              <button onClick={logout} className={styles.logoutButton}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className={styles.loginButton}>
              <i className="fas fa-user"></i> Đăng nhập
            </button>
          )}
          <Link to="/cart">
<<<<<<< HEAD
            <i className="fas fa-shopping-cart"></i> Giỏ hàng
=======
            <i className="fas fa-shopping-cart"></i> Giỏ hàng ({cartCount})
>>>>>>> 9afb2f6 (Cập nhật code)
          </Link>
          <Link to="/location">
            <i className="fas fa-map-marker-alt"></i> Hồ Chí Minh
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.navMenu}>
        <ul>
          <li><Link to="/category/phones"><i className="fas fa-mobile-alt"></i> Điện thoại</Link></li>
          <li><Link to="/category/laptops"><i className="fas fa-laptop"></i> Laptop</Link></li>
          <li><Link to="/category/accessories"><i className="fas fa-headphones"></i> Phụ kiện</Link></li>
          <li><Link to="/category/smartwatches"><i className="fas fa-clock"></i> Smartwatch</Link></li>
          <li><Link to="/category/tablets"><i className="fas fa-tablet-alt"></i> Tablet</Link></li>
          <li><Link to="/category/used"><i className="fas fa-recycle"></i> Máy cũ, Thu cũ</Link></li>
          <li><Link to="/category/screens"><i className="fas fa-tv"></i> Màn hình, Máy in</Link></li>
          <li><Link to="/category/sim"><i className="fas fa-sim-card"></i> Sim, Thẻ cào</Link></li>
          <li><Link to="/category/services"><i className="fas fa-tools"></i> Dịch vụ tiện ích</Link></li>
        </ul>
      </nav>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};

export default Header;
