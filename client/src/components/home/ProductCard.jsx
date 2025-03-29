import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedProducts.module.css';

const ProductCard = ({ product = {} }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

<<<<<<< HEAD
=======
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Trigger a storage event to update the cart count in the header
    window.dispatchEvent(new Event('storage'));

    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

>>>>>>> 9afb2f6 (Cập nhật code)
  return (
    <div className={styles.productCard}>
      <Link to={`/product/${product.id}`} className={styles.productLink}>
        <div className={styles.imageWrapper}>
          <img src={product.image} alt={product.name} />
          {product.discount > 0 && (
            <span className={styles.discountTag}>-{product.discount}%</span>
          )}
        </div>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDesc}>{product.description}</p>
        <div className={styles.priceBox}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </Link>
<<<<<<< HEAD
=======
      <button className={styles.addToCartBtn} onClick={handleAddToCart}>
        <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
      </button>
>>>>>>> 9afb2f6 (Cập nhật code)
    </div>
  );
};

export default ProductCard;