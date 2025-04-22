import React, { useState } from 'react';
import styles from './RegisterModal.module.css';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('Lỗi phản hồi từ máy chủ.');
      }

      if (response.status === 201 || response.status === 200) {
        setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi không xác định!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <h2>Đăng Ký</h2>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.formGroup}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Tên tài khoản"
              className={styles.input}
            />
          </div>
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
            Đăng Ký
          </button>

          <div className={styles.formFooter}>
            <p>
              Đã có tài khoản?{' '}
              <button 
                type="button"
                className={styles.switchButton}
                onClick={onSwitchToLogin}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
