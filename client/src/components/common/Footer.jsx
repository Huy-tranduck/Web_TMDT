import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* About Us Section */}
        <div className={styles.column}>
          <h3>Về chúng tôi</h3>
          <p>
            Chúng tôi là nền tảng thương mại điện tử hàng đầu, cung cấp các sản phẩm tốt nhất cho khách hàng.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className={styles.column}>
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/products">Sản phẩm</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className={styles.column}>
          <h3>Liên hệ</h3>
          <p>Email: support@example.com</p>
          <p>Điện thoại: +123 456 7890</p>
          <p>Địa chỉ: 123, Đường Chính, Thành phố</p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; 2023 Phone Web. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
