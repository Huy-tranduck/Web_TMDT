import React from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.message}>
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {message}
      </div>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
