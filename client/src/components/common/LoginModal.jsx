import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginModal.module.css';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginModal = ({ isOpen, onClose, openRegisterModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // Hàm kiểm tra dữ liệu đầu vào
  const validateInput = (input) => {
    // Kiểm tra ký tự đặc biệt nguy hiểm có thể gây SQL injection
    const dangerousChars = /['";=\-\(\)\*\/\\]/;
    return !dangerousChars.test(input);
  };

  // Xử lý khi CAPTCHA thay đổi
  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra CAPTCHA đã được xác minh chưa
    if (!captchaVerified) {
      setError('Vui lòng xác nhận bạn không phải là robot');
      return;
    }

    // Kiểm tra dữ liệu đầu vào
    if (!validateInput(username)) {
      setError('Tên đăng nhập chứa ký tự không hợp lệ');
      return;
    }

    // Kiểm tra độ dài tên đăng nhập để tránh buffer overflow
    if (username.length < 4 || username.length > 20) {
      setError('Tên đăng nhập phải từ 4-20 ký tự');
      return;
    }

    try {
      // Sử dụng hàm loginWithCredentials từ AuthContext
      const captchaToken = recaptchaRef.current.getValue();
      const userInfo = await loginWithCredentials(username, password, captchaToken);
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
      
      // Reset CAPTCHA khi đăng nhập thất bại
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaVerified(false);
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
              onChange={(e) => setUsername(e.target.value.trim())} // Loại bỏ khoảng trắng đầu/cuối
              required
              minLength={4}
              maxLength={20}
              pattern="[A-Za-z0-9_]+" // Chỉ cho phép chữ cái, số và dấu gạch dưới
              title="Chỉ chấp nhận chữ cái, số và dấu gạch dưới"
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
          
          <div className={styles.captchaContainer}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LemlEMrAAAAAF37PGeaTMu9Vx4z_HVJ5rd2Wewb" // Thay thế bằng SITE KEY của bạn
              onChange={handleCaptchaChange}
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!captchaVerified}
          >
            Đăng Nhập
          </button>
        </form>
        
        {openRegisterModal && (
          <div className={styles.registerPrompt}>
            Chưa có tài khoản? <span onClick={openRegisterModal}>Đăng ký</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
