import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import AdminLayout from './components/layout/AdminLayout';
import Cart from './pages/Cart'; 
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contract';
import FloatingContact from './components/common/FloatingContact';
import TermsAndPrivacy from '../src/components/common/TermsAndPrivacy'; // Import trang điều khoản và quyền riêng tư
import OrderHistory from './pages/OrderHistory';

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

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
           <FloatingContact 
              facebookId={61576528141491}
              // whatsappNumber={whatsappNumber}
            />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms_and_privacy" element={<TermsAndPrivacy />} /> {/* Thêm route mới */}
            <Route path="/user/orders" element={
                            <PrivateRoute>
                              <OrderHistory />
                            </PrivateRoute>
            } />
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <PrivateAdminRoute>
                  <AdminLayout />
                </PrivateAdminRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
