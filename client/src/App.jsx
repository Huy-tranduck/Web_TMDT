import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/common/Header';
import Home from './pages/Home';
import LoginModal from './components/common/LoginModal';
import RegisterModal from './components/common/RegisterModal';

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header
            onLoginClick={() => setIsLoginOpen(true)}
            onRegisterClick={() => setIsRegisterOpen(true)}
          />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
