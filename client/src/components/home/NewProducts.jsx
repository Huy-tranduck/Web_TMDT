import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const NewProducts = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/new');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch new products:', err);
        setError('Could not load new products');
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const displayedProducts = showAll ? products : products.slice(0, 5);
  const remainingProducts = showAll ? [] : products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.new}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>SẢN PHẨM MỚI</h2>
        <div className={styles.productGrid}>
          {displayedProducts.map(product => (
            <ProductCard 
              key={product.masp}
              product={{
                ...product,
                image: product.img, // Map img field to image for ProductCard
                originalPrice: product.price // Sử dụng giá gốc từ price
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

export default NewProducts;
