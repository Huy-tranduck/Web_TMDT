import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.jpg';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Thêm state này
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };
  
  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };
  
  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Toggle menu trên mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
              <div className={styles.dropdown}>
                <span>{user.username}</span>
                <div className={styles.dropdownContent}>
                  <Link to="/user/orders">Đơn mua</Link>
                  <button onClick={logout}>Đăng xuất</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className={styles.loginButton}
              >
                <i className="fas fa-user"></i> Đăng nhập
              </button>
              <button
                onClick={openRegisterModal}
                className={styles.loginButton}
              >
                <i className="fas fa-user-plus"></i> Đăng ký
              </button>
            </>
          )}
          {user && location.pathname !== '/cart' && (
            <Link to="/cart">
              <i className="fas fa-shopping-cart"></i> Giỏ hàng ({cartCount})
            </Link>
          )}

          <Link to="/cart" className={styles.cartButton}>
            <i className="fas fa-shopping-cart"></i>
            <span>Giỏ hàng</span>
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </Link>

          <Link to="/location">
            <i className="fas fa-map-marker-alt"></i> Hồ Chí Minh
          </Link>
        </div>

        {/* Hamburger Menu Toggle */}
        <button className={styles.menuToggle} onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className={`${styles.navMenu} ${isMenuOpen ? styles.navMenuOpen : ''}`}>
        <ul>
          <li>
            <Link to="/category/phones" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-mobile-alt"></i> Điện thoại
            </Link>
          </li>
          <li>
            <Link to="/category/laptops" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-laptop"></i> Laptop
            </Link>
          </li>
          <li>
            <Link to="/category/accessories" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-headphones"></i> Phụ kiện
            </Link>
          </li>
          <li>
            <Link to="/category/smartwatches" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-clock"></i> Smartwatch
            </Link>
          </li>
          <li>
            <Link to="/category/tablets" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-tablet-alt"></i> Tablet
            </Link>
          </li>
          <li>
            <Link to="/category/used" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-recycle"></i> Máy cũ, Thu cũ
            </Link>
          </li>
          <li>
            <Link to="/category/screens" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-tv"></i> Màn hình, Máy in
            </Link>
          </li>
          <li>
            <Link to="/category/sim" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-sim-card"></i> Sim, Thẻ cào
            </Link>
          </li>
          <li>
            <Link to="/category/services" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-tools"></i> Dịch vụ tiện ích
            </Link>
          </li>
          <li>
          <Link to="/contact" className={styles.navLink}>Liên hệ</Link>
          </li>
          <li className={styles.dropdownMenu}>
            <span>Hãng sản xuất</span>
            <div className={styles.dropdownContent}>
              <Link to="/search?company=Apple" onClick={() => setIsMenuOpen(false)}>Apple</Link>
              <Link to="/search?company=Samsung" onClick={() => setIsMenuOpen(false)}>Samsung</Link>
              <Link to="/search?company=Oppo" onClick={() => setIsMenuOpen(false)}>Oppo</Link>
              <Link to="/search?company=Nokia" onClick={() => setIsMenuOpen(false)}>Nokia</Link>
              <Link to="/search?company=Huawei" onClick={() => setIsMenuOpen(false)}>Huawei</Link>
              <Link to="/search?company=Xiaomi" onClick={() => setIsMenuOpen(false)}>Xiaomi</Link>
              <Link to="/search?company=Realme" onClick={() => setIsMenuOpen(false)}>Realme</Link>
              <Link to="/search?company=Vivo" onClick={() => setIsMenuOpen(false)}>Vivo</Link>
              <Link to="/search?company=Philips" onClick={() => setIsMenuOpen(false)}>Philips</Link>
              <Link to="/search?company=Mobell" onClick={() => setIsMenuOpen(false)}>Mobell</Link>
              <Link to="/search?company=Mobiistar" onClick={() => setIsMenuOpen(false)}>Mobiistar</Link>
              <Link to="/search?company=Itel" onClick={() => setIsMenuOpen(false)}>Itel</Link>
              <Link to="/search?company=Coolpad" onClick={() => setIsMenuOpen(false)}>Coolpad</Link>
              <Link to="/search?company=HTC" onClick={() => setIsMenuOpen(false)}>HTC</Link>
              <Link to="/search?company=Motorola" onClick={() => setIsMenuOpen(false)}>Motorola</Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          openRegisterModal={openRegisterModal} 
        />
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal 
          isOpen={showRegisterModal} 
          onClose={() => setShowRegisterModal(false)}
          openLoginModal={openLoginModal} 
        />
      )}
    </header>
  );
};

export default Header;