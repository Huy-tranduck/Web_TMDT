import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert('Đăng nhập thành công!');
        if (data.token && data.user) {
          login({ ...data.user, token: data.token }); // Gọi hàm login với user và token
          onClose(); // Đóng modal
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

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default LoginModal;
