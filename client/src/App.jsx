import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import FloatingContact from './components/common/FloatingContact';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  // Thay thế bằng Facebook ID và số WhatsApp của bạn
  const facebookId = '100001234567890'; // ID Facebook của bạn
  const whatsappNumber = '84123456789'; // Số WhatsApp của bạn (thêm mã quốc gia không có dấu +)

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            
            {/* Thêm các nút liên hệ trôi nổi */}
            <FloatingContact 
              facebookId={61576528141491}
              // whatsappNumber={whatsappNumber}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
