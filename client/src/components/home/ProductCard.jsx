import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './FeaturedProducts.module.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const formatPrice = (priceStr) => {
        return priceStr + '₫';
    };

    const handleAddToCart = () => {
        const isLoggedIn = localStorage.getItem('user');
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
            navigate('/login');
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find((item) => item.id === product.masp); // Thay đổi product.id thành product.masp

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: product.masp,
                name: product.name,
                image: product.img,
                price: product.price,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    };

    return (
        <div className={styles.productCard}>
            <Link to={`/product/${product.masp}`} className={styles.productLink}>
                <div className={styles.imageWrapper}>
                    <img src={product.img} alt={product.name} />
                    {product.promo && product.promo.name === 'giamgia' && (
                        <span className={styles.discountTag}>
                            -{product.promo.value}₫
                        </span>
                    )}
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
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
        </div>
    );
};

export default ProductCard;