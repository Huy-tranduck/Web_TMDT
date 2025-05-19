import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(credentials.username, credentials.password);
    if (result.success) {
      // Kiểm tra xem có trang trước đó không
      const from = location.state?.from || '/';
      navigate(from);
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
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

export default Login;
