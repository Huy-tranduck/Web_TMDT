import React, { useState } from 'react';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [showAll, setShowAll] = useState(false);

  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 29990000,
      originalPrice: 34990000,
      image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
      discount: 15,
      description: "6.7 inch, 8GB RAM, 256GB"
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra",
      price: 23990000,
      originalPrice: 26990000,
      image: "/images/products/s23ultra.jpg",
      discount: 12,
      description: "6.8 inch, 12GB RAM, 256GB"
    },
    {
      id: 3,
      name: "Xiaomi 13T Pro",
      price: 15990000,
      originalPrice: 17990000,
      image: "/images/products/xiaomi13t.jpg",
      discount: 10,
      description: "6.67 inch, 12GB RAM, 256GB"
    },
    {
      id: 4,
      name: "OPPO Find N3",
      price: 44990000,
      originalPrice: 46990000,
      image: "/images/products/oppon3.jpg",
      discount: 5,
      description: "7.8 inch, 16GB RAM, 512GB"
    },
    {
      id: 5,
      name: "Nokia 123",
      price: 44990000,
      originalPrice: 46990000,
      image: "/images/products/oppon3.jpg",
      discount: 5,
      description: "7.8 inch, 16GB RAM, 512GB"
    },
    {
      id: 6,
      name: "iPhone 15 Pro Max",
      price: 29990000,
      originalPrice: 34990000,
      image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
      discount: 15,
      description: "6.7 inch, 8GB RAM, 256GB"
    },
    {
      id: 7,
      name: "Samsung Galaxy S23 Ultra",
      price: 23990000,
      originalPrice: 26990000,
      image: "/images/products/s23ultra.jpg",
      discount: 12,
      description: "6.8 inch, 12GB RAM, 256GB"
    },
    {
      id: 8,
      name: "Xiaomi 13T Pro",
      price: 15990000,
      originalPrice: 17990000,
      image: "/images/products/xiaomi13t.jpg",
      discount: 10,
      description: "6.67 inch, 12GB RAM, 256GB"
    },
    {
      id: 9,
      name: "OPPO Find N3",
      price: 44990000,
      originalPrice: 46990000,
      image: "/images/products/oppon3.jpg",
      discount: 5,
      description: "7.8 inch, 16GB RAM, 512GB"
    },
    {
      id: 10,
      name: "Nokia 123",
      price: 44990000,
      originalPrice: 46990000,
      image: "/images/products/oppon3.jpg",
      discount: 5,
      description: "7.8 inch, 16GB RAM, 512GB"
    }
  ];

  const featuredProducts = products.slice(0, 5);
  const remainingProducts = products.slice(5);

  return (
    <section className={`${styles.featuredProducts} ${styles.featured}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>SẢN PHẨM NỔI BẬT NHẤT</h2>
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

export default FeaturedProducts;
