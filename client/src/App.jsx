import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider,  useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/common/Header';
import Home from './pages/Home';
import LoginModal from './components/common/LoginModal';
import RegisterModal from './components/common/RegisterModal';
import './App.css';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import FloatingContact from './components/common/FloatingContact';
import AdminLayout from './components/admin/AdminLayout';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

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
            <Route 
              path="/admin/*" 
              element={
                <PrivateAdminRoute>
                  <AdminLayout />
                </PrivateAdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
