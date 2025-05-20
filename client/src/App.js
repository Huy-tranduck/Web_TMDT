import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import AdminLayout from './components/layout/AdminLayout';
import Cart from './pages/Cart'; 
import SearchResults from './pages/SearchResults';
import Contact from './pages/Contract';
import FloatingContact from './components/common/FloatingContact';
import TermsAndPrivacy from '../src/components/common/TermsAndPrivacy'; // Import trang điều khoản và quyền riêng tư
// Component bảo vệ route admin
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <FloatingContact 
              facebookId={61576528141491}
              // whatsappNumber={whatsappNumber}
            />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms_and_privacy" element={<TermsAndPrivacy />} /> {/* Thêm route mới */}
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            } 
          
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
