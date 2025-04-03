import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal = ({ onClose, message }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      onClose();
    } catch (error) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Đăng nhập</h2>
        {message && <p className={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Tên đăng nhập:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
