import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const GiaSocOnline = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchShockingProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/shocking');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch shocking products:', err);
                setError('Could not load shocking products');
                setLoading(false);
            }
        };

        fetchShockingProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const displayedProducts = showAll ? products : products.slice(0, 5);

    return (
        <section className={`${styles.featuredProducts} ${styles.giaSoc}`}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>GIÁ SỐC ONLINE</h2>
                <div className={styles.productGrid}>
                    {displayedProducts.map(product => (
                        <ProductCard 
                            key={product.masp}
                            product={{
                                ...product,
                                image: product.img,
                                originalPrice: product.price,
                                price: product.promo.value // Sử dụng giá khuyến mãi
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

export default GiaSocOnline;
