import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra thông tin đăng nhập
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      login({ 
        username: credentials.username,
        role: 'admin'
      });
      navigate('/admin');
      return;
    } 
    
    if (credentials.username === 'test' && credentials.password === 'test123') {
      login({
        username: credentials.username,
        role: 'user'
      });
      navigate('/');
      return;
    }

    setError('Tên đăng nhập hoặc mật khẩu không chính xác');
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

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> 9afb2f6 (Cập nhật code)
