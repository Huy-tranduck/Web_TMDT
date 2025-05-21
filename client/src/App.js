import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
// import PrivateRoute from './components/common/PrivateRoute';
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
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            } 
            
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
