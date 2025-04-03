import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
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
  const location = useLocation(); // Get current route

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Update cart count dynamically
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
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
          {user && location.pathname !== '/cart' && ( // Show cart button only if logged in
            <Link to="/cart">
              <i className="fas fa-shopping-cart"></i> Giỏ hàng ({cartCount})
            </Link>
          )}
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
