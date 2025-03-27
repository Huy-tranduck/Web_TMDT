import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal = ({ onClose }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      login({ username: credentials.username, role: 'admin' });
      onClose();
      navigate('/admin');
      return;
    }

    if (credentials.username === 'test' && credentials.password === 'test123') {
      login({ username: credentials.username, role: 'user' });
      onClose();
      return;
    }

    setError('Tên đăng nhập hoặc mật khẩu không chính xác');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
