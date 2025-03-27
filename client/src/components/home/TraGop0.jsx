import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const TraGop0 = () => {
  const [showAll, setShowAll] = useState(false);

  // Sample data cho Trả góp 0%
  const products = [
    { id: 201, name: "Trả góp 0% - Sản phẩm 1", price: 21990000, originalPrice: 24990000, image: "/images/products/tragop1.jpg", discount: 0, description: "Ưu đãi trả góp 0% sản phẩm 1" },
    { id: 202, name: "Trả góp 0% - Sản phẩm 2", price: 19990000, originalPrice: 22990000, image: "/images/products/tragop2.jpg", discount: 0, description: "Ưu đãi trả góp 0% sản phẩm 2" },
    { id: 203, name: "Trả góp 0% - Sản phẩm 3", price: 17990000, originalPrice: 20990000, image: "/images/products/tragop3.jpg", discount: 0, description: "Ưu đãi trả góp 0% sản phẩm 3" },
    { id: 204, name: "Trả góp 0% - Sản phẩm 4", price: 24990000, originalPrice: 27990000, image: "/images/products/tragop4.jpg", discount: 0, description: "Ưu đãi trả góp 0% sản phẩm 4" },
    { id: 205, name: "Trả góp 0% - Sản phẩm 5", price: 28990000, originalPrice: 31990000, image: "/images/products/tragop5.jpg", discount: 0, description: "Ưu đãi trả góp 0% sản phẩm 5" },
    { id: 206, name: "Trả góp 0% - Sản phẩm 6", price: 26990000, originalPrice: 29990000, image: "/images/products/tragop6.jpg", discount: 0, description: "Ưu đãi trả góp 0% sản phẩm 6" }
  ];

  const initialProducts = products.slice(0, 5);
  const remainingProducts = products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.traGop}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>TRẢ GÓP 0%</h2>
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

export default TraGop0;
