import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra user trong localStorage khi khởi động
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu user từ localStorage:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Hàm này để lưu thông tin người dùng đã xác thực
  const login = (userData) => {
    try {
      console.log("Đang lưu thông tin người dùng:", userData);
      
      // Kiểm tra dữ liệu đầu vào
      if (!userData) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }
      
      // Xử lý token nếu có
      const token = userData.token;
      const userInfo = { ...userData };
      
      if (token) {
        delete userInfo.token; // Không lưu token trong user object
        localStorage.setItem('token', token);
      }
      
      // Lưu thông tin user
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return userInfo;
    } catch (error) {
      console.error("Lỗi khi lưu thông tin đăng nhập:", error);
      throw error;
    }
  };

  // Cập nhật hàm loginWithCredentials
  const loginWithCredentials = async (username, password, captchaToken) => {
    try {
      console.log("Đang gọi API đăng nhập với username:", username);
      
      // Kiểm tra để tránh SQL injection
      const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error("Tên đăng nhập không hợp lệ");
      }
      
      // Gửi cả token CAPTCHA
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password,
          captchaToken  // Thêm token CAPTCHA
        }),
      });

      const data = await response.json();
      console.log("Phản hồi từ API đăng nhập:", data);

      if (!response.ok) throw new Error(data.message || "Lỗi đăng nhập");

      if (!data.token || !data.user) {
        throw new Error("API trả về dữ liệu không hợp lệ");
      }

      // Gọi hàm login để lưu thông tin đăng nhập
      const userWithToken = {
        ...data.user,
        token: data.token
      };
      
      return login(userWithToken);
    } catch (error) {
      console.error("Lỗi khi gọi API đăng nhập:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    login,
    loginWithCredentials,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
