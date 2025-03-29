import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CartProvider } from './contexts/CartContext'; // Thêm lại import

ReactDOM.render(
  <React.StrictMode>
    <CartProvider> {/* Bọc App trong CartProvider */}
      <App />
    </CartProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
