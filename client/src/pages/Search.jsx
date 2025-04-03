import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import styles from './Search.module.css';

const Search = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('query') || '';
    setQuery(searchQuery);

    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/search?query=${searchQuery}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [location.search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
