import React, { useState } from 'react';

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
    <div className="modal">
      <div className="modal-content">
        <h2>Đăng Ký</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Tên tài khoản:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button type="submit">Đăng Ký</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default RegisterModal;
