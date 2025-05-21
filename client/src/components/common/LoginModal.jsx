import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Đang đăng nhập với username:', username);

    try {
      // Sử dụng hàm loginWithCredentials từ AuthContext
      const userInfo = await loginWithCredentials(username, password);
      console.log('Đăng nhập thành công:', userInfo);
      
      alert('Đăng nhập thành công!');
      onClose();
      
      // Chuyển hướng dựa vào vai trò
      if (userInfo.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message || 'Đăng nhập thất bại!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay || styles.modalOverlay}>
      <div className={styles.modal || styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Đăng Nhập</h2>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Tên tài khoản:</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={4}
              maxLength={20}
              placeholder="Nhập tên tài khoản"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mật khẩu:</label>
            <input
              className={styles.input}
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={32}
              placeholder="Nhập mật khẩu"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
