import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Logo</Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/cart" className={styles.cartLink}>
          <i className="fas fa-shopping-cart"></i>
          <span className={styles.cartCount}>{cartCount}</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
