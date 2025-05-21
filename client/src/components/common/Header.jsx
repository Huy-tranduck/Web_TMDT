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
      </div>

      {/* Navigation Menu */}
      <nav className={styles.navMenu}>
        <ul>
          <li>
            <Link to="/category/phones">
              <i className="fas fa-mobile-alt"></i> Điện thoại
            </Link>
          </li>
          <li>
            <Link to="/category/laptops">
              <i className="fas fa-laptop"></i> Laptop
            </Link>
          </li>
          <li>
            <Link to="/category/accessories">
              <i className="fas fa-headphones"></i> Phụ kiện
            </Link>
          </li>
          <li>
            <Link to="/category/smartwatches">
              <i className="fas fa-clock"></i> Smartwatch
            </Link>
          </li>
          <li>
            <Link to="/category/tablets">
              <i className="fas fa-tablet-alt"></i> Tablet
            </Link>
          </li>
          <li>
            <Link to="/category/used">
              <i className="fas fa-recycle"></i> Máy cũ, Thu cũ
            </Link>
          </li>
          <li>
            <Link to="/category/screens">
              <i className="fas fa-tv"></i> Màn hình, Máy in
            </Link>
          </li>
          <li>
            <Link to="/category/sim">
              <i className="fas fa-sim-card"></i> Sim, Thẻ cào
            </Link>
          </li>
          <li>
            <Link to="/category/services">
              <i className="fas fa-tools"></i> Dịch vụ tiện ích
            </Link>
          </li>
          <li>
          <Link to="/contact" className={styles.navLink}>Liên hệ</Link>
          </li>
          <li className={styles.dropdownMenu}>
            <span>Hãng sản xuất</span>
            <div className={styles.dropdownContent}>
              <Link to="/search?company=Apple">Apple</Link>
              <Link to="/search?company=Samsung">Samsung</Link>
              <Link to="/search?company=Oppo">Oppo</Link>
              <Link to="/search?company=Nokia">Nokia</Link>
              <Link to="/search?company=Huawei">Huawei</Link>
              <Link to="/search?company=Xiaomi">Xiaomi</Link>
              <Link to="/search?company=Realme">Realme</Link>
              <Link to="/search?company=Vivo">Vivo</Link>
              <Link to="/search?company=Philips">Philips</Link>
              <Link to="/search?company=Mobell">Mobell</Link>
              <Link to="/search?company=Mobiistar">Mobiistar</Link>
              <Link to="/search?company=Itel">Itel</Link>
              <Link to="/search?company=Coolpad">Coolpad</Link>
              <Link to="/search?company=HTC">HTC</Link>
              <Link to="/search?company=Motorola">Motorola</Link>
              
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
