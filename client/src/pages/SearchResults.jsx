import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Giả lập danh sách sản phẩm
    const fetchProducts = async () => {
      const allProducts = [
        { id: "1", name: "iPhone 15 Pro Max", price: 29990000, image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg" },
        { id: "2", name: "Samsung Galaxy S23 Ultra", price: 23990000, image: "/images/products/s23ultra.jpg" },
        { id: "3", name: "Xiaomi 13T Pro", price: 15990000, image: "/images/products/xiaomi13t.jpg" },
        { id: "4", name: "OPPO Find N3", price: 44990000, image: "/images/products/oppon3.jpg" },
        { id: "5", name: "Nokia 123", price: 9990000, image: "/images/products/nokia123.jpg" }
      ];
      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (query && products.length > 0) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]); // Đặt danh sách rỗng nếu không có query
    }
  }, [query, products]);

  return (
    <div className={styles.searchResults}>
      <h1>Kết quả tìm kiếm cho: "{query}"</h1>
      {filteredProducts.length > 0 ? (
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      )}
    </div>
  );
};

export default SearchResults;
