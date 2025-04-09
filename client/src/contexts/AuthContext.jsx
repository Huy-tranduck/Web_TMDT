import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Lấy thông tin user từ localStorage
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token); // Lưu token vào localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Lưu thông tin user vào localStorage
    setUser(userData); // Cập nhật trạng thái user
  };

  const logout = () => {
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('user');  // Xóa thông tin user
    setUser(null);                    // Đặt trạng thái user về null
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
