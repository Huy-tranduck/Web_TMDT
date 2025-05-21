import React from 'react';
import styles from './FloatingContact.module.css';

// Import các icon từ react-icons hoặc sử dụng hình ảnh
import { FaFacebookMessenger, FaWhatsapp } from 'react-icons/fa';

const FloatingContact = ({ facebookId, whatsappNumber }) => {
  // Link đến Facebook Messenger với ID của bạn
  const messengerUrl = `https://m.me/${facebookId}`;
  
  // Link đến WhatsApp với số điện thoại của bạn
//   const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className={styles.floatingContactContainer}>
      <a 
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactButton} ${styles.messengerButton}`}
        aria-label="Liên hệ qua Facebook Messenger"
      >
        <FaFacebookMessenger size={24} />
      </a>
      {/* <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactButton} ${styles.whatsappButton}`}
        aria-label="Liên hệ qua WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a> */}
    </div>
  );
};

export default FloatingContact;