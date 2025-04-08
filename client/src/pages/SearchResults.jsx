import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import styles from './SearchResults.module.css';
import Header from '../components/common/Header';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const company = searchParams.get('company');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query && !company) {
                setLoading(false);
                return;
            }

            try {
                let url;
                if (company) {
                    url = `http://localhost:5000/api/products/company/${company}`;
                } else {
                    url = `http://localhost:5000/api/products/search?query=${query}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.error('Search Error:', err);
                setError('Không thể tìm kiếm sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, company]);

    return (
        <>
            <Header />
            <div className={styles.searchResults}>
                <h1 className={styles.searchTitle}>
                    {results.length > 0 
                        ? `${company ? 'Sản phẩm ' + company : 'Kết quả tìm kiếm cho "' + query + '"'} (${results.length} sản phẩm)`
                        : `Không tìm thấy sản phẩm ${company ? 'của ' + company : 'cho "' + query + '"'}`
                    }
                </h1>

                {loading && <div className={styles.loading}>Đang tìm kiếm...</div>}
                
                {error && <div className={styles.error}>{error}</div>}
                
                {!loading && !error && (
                    <div className={styles.productGrid}>
                        {results.map(product => (
                            <ProductCard 
                                key={product.masp}
                                product={{
                                    ...product,
                                    image: product.img,
                                    originalPrice: product.price
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchResults;
