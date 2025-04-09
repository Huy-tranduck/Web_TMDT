import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './FeaturedProducts.module.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const formatPrice = (priceStr) => {
        return priceStr + '₫';
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product._id }),
            });
            console.log("Dữ liệu gửi lên:", { productId: product._id }) // Kiểm tra dữ liệu gửi lên

            if (response.ok) {
                alert('Sản phẩm đã được thêm vào giỏ hàng!');
            } else {
                throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            console.error(error.message);
        }
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