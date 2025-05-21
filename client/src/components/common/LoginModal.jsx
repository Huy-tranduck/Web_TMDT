import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Đăng nhập thành công!');
        if (data.token && data.user) {
          login({ ...data.user, token: data.token });
          onClose();
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi không xác định!');
    }
  };

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
          <button type="submit" className={styles.submitButton}>Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
