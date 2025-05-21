import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterModal.module.css';

const RegisterModal = ({ isOpen, onClose, openLoginModal }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    gender: 'other',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsRegistering(true);
  
    // Regex kiểm tra username: chỉ chữ, số và dấu gạch dưới
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
    // Kiểm tra ký tự đặc biệt trong username
    if (!usernameRegex.test(formData.username)) {
      setError('Tên tài khoản không được chứa ký tự đặc biệt!');
      setIsRegistering(false);
      return;
    }
  
    // Giới hạn độ dài tên tài khoản
    if (formData.username.length < 4 || formData.username.length > 20) {
      setError('Tên tài khoản phải từ 4 đến 20 ký tự.');
      setIsRegistering(false);
      return;
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ (cần 10-11 chữ số)');
      setIsRegistering(false);
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsRegistering(false);
      return;
    }

    // Kiểm tra đồng ý điều khoản
    if (!formData.agreeToTerms) {
      setError('Vui lòng đồng ý với điều khoản và chính sách.');
      setIsRegistering(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 201 || response.status === 200) {
        setSuccess('Đăng ký thành công! Đang chuyển đến đăng nhập...');
        setFormData({
          fullName: '',
          username: '',
          gender: 'other',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
        setTimeout(() => {
          onClose();
          openLoginModal();
        }, 1500);
      } else {
        setError(data.message || 'Đăng ký thất bại!');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi không xác định!');
    } finally {
      setIsRegistering(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label>Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Tên tài khoản:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Tên tài khoản từ 4-20 ký tự"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Giới tính:</label>
            <select 
              name="gender" 
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Nhập số điện thoại (10-11 số)"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
              minLength="6"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              minLength="6"
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeToTerms">
              Tôi đồng ý với <Link to="/terms_and_privacy" onClick={(e) => e.stopPropagation()}>điều khoản và chính sách bảo mật </Link> 
            </label>
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          
          <button type="submit" className={styles.submitButton} disabled={isRegistering}>
            {isRegistering ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
        <div className={styles.loginPrompt}>
          Đã có tài khoản? <span onClick={() => {onClose(); openLoginModal();}}>Đăng nhập</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
