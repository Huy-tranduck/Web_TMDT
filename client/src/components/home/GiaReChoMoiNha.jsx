import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const GiaReChoMoiNha = () => {
  const [showAll, setShowAll] = useState(false);

  // Sample data cho Giá rẻ cho mọi nhà
  const products = [
    { id: 501, name: "Giá rẻ cho mọi nhà - Sản phẩm 1", price: 6990000, originalPrice: 10990000, image: "/images/products/giare1.jpg", discount: 36, description: "Ưu đãi giá rẻ cho mọi nhà sản phẩm 1" },
    { id: 502, name: "Giá rẻ cho mọi nhà - Sản phẩm 2", price: 7990000, originalPrice: 11990000, image: "/images/products/giare2.jpg", discount: 33, description: "Ưu đãi giá rẻ cho mọi nhà sản phẩm 2" },
    { id: 503, name: "Giá rẻ cho mọi nhà - Sản phẩm 3", price: 8990000, originalPrice: 12990000, image: "/images/products/giare3.jpg", discount: 31, description: "Ưu đãi giá rẻ cho mọi nhà sản phẩm 3" },
    { id: 504, name: "Giá rẻ cho mọi nhà - Sản phẩm 4", price: 9990000, originalPrice: 13990000, image: "/images/products/giare4.jpg", discount: 28, description: "Ưu đãi giá rẻ cho mọi nhà sản phẩm 4" },
    { id: 505, name: "Giá rẻ cho mọi nhà - Sản phẩm 5", price: 8490000, originalPrice: 11990000, image: "/images/products/giare5.jpg", discount: 29, description: "Ưu đãi giá rẻ cho mọi nhà sản phẩm 5" },
    { id: 506, name: "Giá rẻ cho mọi nhà - Sản phẩm 6", price: 8990000, originalPrice: 12990000, image: "/images/products/giare6.jpg", discount: 30, description: "Ưu đãi giá rẻ cho mọi nhà sản phẩm 6" }
  ];

  const initialProducts = products.slice(0, 5);
  const remainingProducts = products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.giaRe}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>GIÁ RẺ CHO MỌI NHÀ</h2>
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

export default GiaReChoMoiNha;
