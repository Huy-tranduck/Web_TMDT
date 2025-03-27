import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>Về chúng tôi</h3>
          <ul>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/careers">Tuyển dụng</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Hỗ trợ khách hàng</h3>
          <ul>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
            <li><a href="/shipping">Chính sách vận chuyển</a></li>
            <li><a href="/returns">Chính sách đổi trả</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Kết nối với chúng tôi</h3>
          <ul className={styles.socialLinks}>
            <li><a href="https://facebook.com"><i className="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="https://twitter.com"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="https://instagram.com"><i className="fab fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; 2023 Phone Web. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
