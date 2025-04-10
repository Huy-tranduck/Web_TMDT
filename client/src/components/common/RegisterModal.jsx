import React, { useState } from 'react';
import styles from './RegisterModal.module.css'; // Import CSS module

const RegisterModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Regex kiểm tra username: chỉ chữ, số và dấu gạch dưới
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
    // Kiểm tra ký tự đặc biệt
    if (!usernameRegex.test(username)) {
      setError('Tên tài khoản không được chứa ký tự đặc biệt!');
      return;
    }
  
    // Giới hạn độ dài tên tài khoản
    if (username.length < 4 || username.length > 20) {
      setError('Tên tài khoản phải từ 4 đến 20 ký tự.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
  
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Đăng Ký</h2>
        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label>Tên tài khoản:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button type="submit" className={styles.submitButton}>
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
