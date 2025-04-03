import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false); // Thêm state showAll

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/featured');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Logic hiển thị sản phẩm dựa vào showAll
    const displayedProducts = showAll ? products : products.slice(0, 5);

    return (
        <section className={`${styles.featuredProducts} ${styles.featured}`}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>SẢN PHẨM NỔI BẬT NHẤT</h2>
                <div className={styles.productGrid}>
                    {displayedProducts.map(product => (
                        <ProductCard 
                            key={product.masp} 
                            product={{
                                ...product,
                                image: product.img,
                                originalPrice: product.price
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

export default FeaturedProducts;
