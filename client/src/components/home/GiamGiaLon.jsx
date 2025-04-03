import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const GiamGiaLon = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchBigDiscountProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/bigdiscount');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch big discount products:', err);
                setError('Could not load products');
                setLoading(false);
            }
        };

        fetchBigDiscountProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const displayedProducts = showAll ? products : products.slice(0, 5);

    return (
        <section className={`${styles.featuredProducts} ${styles.giamGia}`}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>GIẢM GIÁ LỚN</h2>
                <div className={styles.productGrid}>
                    {displayedProducts.map(product => (
                        <ProductCard 
                            key={product.masp}
                            product={{
                                ...product,
                                image: product.img,
                                originalPrice: product.price,
                                price: (parseFloat(product.price.replace(/\./g, '')) - parseFloat(product.promo.value)).toLocaleString('vi-VN')
                            }}
                        />
                    ))}
                </div>
                {products.length > 5 && (
                    <div className={styles.viewAllWrapper}>
                        <div onClick={() => setShowAll(!showAll)} className={styles.viewAllTrigger}>
                            <span>{showAll ? 'Thu gọn' : 'Xem tất cả sản phẩm'}</span>
                            <i className={`fas ${showAll ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default GiamGiaLon;
