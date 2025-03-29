import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import styles from './Search.module.css';

const Search = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q') || '';
    setQuery(searchQuery);

    // Giả lập danh sách sản phẩm
    const products = [
      { id: 1, name: "iPhone 15 Pro Max", price: 29990000, image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg" },
      { id: 2, name: "Samsung Galaxy S23 Ultra", price: 23990000, image: "/images/products/s23ultra.jpg" },
      { id: 3, name: "Xiaomi 13T Pro", price: 15990000, image: "/images/products/xiaomi13t.jpg" },
      // ... thêm sản phẩm khác
    ];

    // Lọc sản phẩm theo từ khóa
    const filteredResults = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filteredResults);
  }, [location.search]);

  return (
    <div className={styles.searchContainer}>
      <h1>Kết quả tìm kiếm cho: "{query}"</h1>
      {results.length > 0 ? (
        <div className={styles.resultsGrid}>
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
    </div>
  );
};

export default Search;
