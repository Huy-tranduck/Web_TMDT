import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const GiamGiaLon = () => {
  const [showAll, setShowAll] = useState(false);

  // Sample data cho Giảm giá lớn
  const products = [
    { id: 401, name: "Giảm giá lớn - Sản phẩm 1", price: 9990000, originalPrice: 15990000, image: "/images/products/giamgia1.jpg", discount: 38, description: "Ưu đãi giảm giá lớn sản phẩm 1" },
    { id: 402, name: "Giảm giá lớn - Sản phẩm 2", price: 8990000, originalPrice: 13990000, image: "/images/products/giamgia2.jpg", discount: 35, description: "Ưu đãi giảm giá lớn sản phẩm 2" },
    { id: 403, name: "Giảm giá lớn - Sản phẩm 3", price: 7990000, originalPrice: 12990000, image: "/images/products/giamgia3.jpg", discount: 38, description: "Ưu đãi giảm giá lớn sản phẩm 3" },
    { id: 404, name: "Giảm giá lớn - Sản phẩm 4", price: 11990000, originalPrice: 17990000, image: "/images/products/giamgia4.jpg", discount: 33, description: "Ưu đãi giảm giá lớn sản phẩm 4" },
    { id: 405, name: "Giảm giá lớn - Sản phẩm 5", price: 10990000, originalPrice: 16990000, image: "/images/products/giamgia5.jpg", discount: 35, description: "Ưu đãi giảm giá lớn sản phẩm 5" },
    { id: 406, name: "Giảm giá lớn - Sản phẩm 6", price: 12990000, originalPrice: 18990000, image: "/images/products/giamgia6.jpg", discount: 32, description: "Ưu đãi giảm giá lớn sản phẩm 6" }
  ];

  const initialProducts = products.slice(0, 5);
  const remainingProducts = products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.giamGia}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>GIẢM GIÁ LỚN</h2>
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

export default GiamGiaLon;
