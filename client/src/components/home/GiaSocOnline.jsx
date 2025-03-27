import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const GiaSocOnline = () => {
  const [showAll, setShowAll] = useState(false);

  // Sample data cho Giá sốc online
  const products = [
    { id: 301, name: "Giá sốc online - Sản phẩm 1", price: 14990000, originalPrice: 18990000, image: "/images/products/giasoc1.jpg", discount: 20, description: "Ưu đãi giá sốc online sản phẩm 1" },
    { id: 302, name: "Giá sốc online - Sản phẩm 2", price: 13990000, originalPrice: 17990000, image: "/images/products/giasoc2.jpg", discount: 22, description: "Ưu đãi giá sốc online sản phẩm 2" },
    { id: 303, name: "Giá sốc online - Sản phẩm 3", price: 12990000, originalPrice: 16990000, image: "/images/products/giasoc3.jpg", discount: 23, description: "Ưu đãi giá sốc online sản phẩm 3" },
    { id: 304, name: "Giá sốc online - Sản phẩm 4", price: 15990000, originalPrice: 19990000, image: "/images/products/giasoc4.jpg", discount: 20, description: "Ưu đãi giá sốc online sản phẩm 4" },
    { id: 305, name: "Giá sốc online - Sản phẩm 5", price: 17990000, originalPrice: 21990000, image: "/images/products/giasoc5.jpg", discount: 18, description: "Ưu đãi giá sốc online sản phẩm 5" },
    { id: 306, name: "Giá sốc online - Sản phẩm 6", price: 16990000, originalPrice: 20990000, image: "/images/products/giasoc6.jpg", discount: 19, description: "Ưu đãi giá sốc online sản phẩm 6" }
  ];

  const initialProducts = products.slice(0, 5);
  const remainingProducts = products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.giaSoc}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>GIÁ SỐC ONLINE</h2>
        <div className={styles.productGrid}>
          {initialProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {showAll && (
          <div className={styles.productGrid}>
            {remainingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className={styles.viewAllWrapper}>
          <div onClick={() => setShowAll(!showAll)} className={styles.viewAllTrigger}>
            <span>{showAll ? 'Thu gọn' : 'Xem tất cả sản phẩm'}</span>
            <i className={`fas ${showAll ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiaSocOnline;
