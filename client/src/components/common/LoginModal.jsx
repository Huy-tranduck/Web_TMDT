import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';
import RegisterModal from './RegisterModal';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await login({ email, password });
      onClose();
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2>Đăng Nhập</h2>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mật khẩu"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Đăng Nhập
          </button>

          <div className={styles.formFooter}>
            <a href="#forgot-password">Quên mật khẩu?</a>
            <p>
              Chưa có tài khoản?{' '}
              <button 
                type="button"
                className={styles.switchButton}
                onClick={onSwitchToRegister}
              >
                Đăng ký
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
