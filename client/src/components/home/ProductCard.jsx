import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedProducts.module.css';

const ProductCard = ({ product }) => {
    const formatPrice = (priceStr) => {
        return priceStr + '₫';
    };

    return (
        <div className={styles.productCard}>
            <Link to={`/product/${product.masp}`} className={styles.productLink}>
                <div className={styles.imageWrapper}>
                    <img src={product.img} alt={product.name} />
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.priceBox}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                </div>
                <div className={styles.rating}>
                    {[...Array(5)].map((_, index) => (
                        <i 
                            key={index}
                            className={`fa fa-star ${index < product.star ? styles.active : ''}`}
                        />
                    ))}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;