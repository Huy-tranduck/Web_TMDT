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
    </div>
  );
};

export default ProductCard;