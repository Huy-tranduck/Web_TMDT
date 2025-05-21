import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal = ({ isOpen, onClose, openRegisterModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Sử dụng hàm login từ AuthContext
      await login({ username, password });
      
      // Nếu đăng nhập thành công (không có lỗi), đóng modal
      onClose();
      
      // Chuyển hướng người dùng nếu cần
      // navigate('/'); // Có thể bỏ dòng này vì đã xử lý trong AuthContext
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message || 'Đăng nhập thất bại!');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Tên tài khoản:</label>
            <input
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
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        <div className={styles.registerPrompt}>
          Chưa có tài khoản? <span onClick={() => {onClose(); openRegisterModal && openRegisterModal();}}>Đăng ký ngay</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
