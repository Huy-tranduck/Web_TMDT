import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css'; // Dùng chung style

const NewProducts = () => {
  const [showAll, setShowAll] = useState(false);

  // Danh sách sản phẩm mới (cập nhật theo yêu cầu)
  const products = [
    {
      id: 101,
      name: "Sản phẩm mới 1",
      price: 19990000,
      originalPrice: 21990000,
      image: "/images/products/new1.jpg",
      discount: 8,
      description: "Mô tả sản phẩm mới 1"
    },
    {
      id: 102,
      name: "Sản phẩm mới 2",
      price: 15990000,
      originalPrice: 17990000,
      image: "/images/products/new2.jpg",
      discount: 10,
      description: "Mô tả sản phẩm mới 2"
    },
    {
      id: 103,
      name: "Sản phẩm mới 3",
      price: 12990000,
      originalPrice: 14990000,
      image: "/images/products/new3.jpg",
      discount: 12,
      description: "Mô tả sản phẩm mới 3"
    },
    {
      id: 104,
      name: "Sản phẩm mới 4",
      price: 24990000,
      originalPrice: 26990000,
      image: "/images/products/new4.jpg",
      discount: 7,
      description: "Mô tả sản phẩm mới 4"
    },
    {
      id: 105,
      name: "Sản phẩm mới 5",
      price: 34990000,
      originalPrice: 36990000,
      image: "/images/products/new5.jpg",
      discount: 6,
      description: "Mô tả sản phẩm mới 5"
    },
    {
      id: 106,
      name: "Sản phẩm mới 6",
      price: 18990000,
      originalPrice: 20990000,
      image: "/images/products/new6.jpg",
      discount: 9,
      description: "Mô tả sản phẩm mới 6"
    }
    // ... có thể thêm sản phẩm nếu cần
  ];

  const featuredProducts = products.slice(0, 5);
  const remainingProducts = products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.new}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>SẢN PHẨM MỚI</h2>
        <div className={styles.productGrid}>
          {featuredProducts.map(product => (
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

export default NewProducts;
