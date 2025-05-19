import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './FeaturedProducts.module.css';
import LoginModal from '../common/LoginModal';
import Toast from '../common/Toast';


const ProductCard = ({ product }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const formatPrice = (priceStr) => {
        return priceStr + '₫';
    };

    const handleAddToCart = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const result = await addToCart(product._id);
        if (result.success) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } else {
            alert(result.error || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    };
    
    return (
        <>
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

            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    message="Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
                />
            )}

            {showToast && (
                <Toast 
                    message="Đã thêm sản phẩm vào giỏ hàng"
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
};

export default ProductCard;