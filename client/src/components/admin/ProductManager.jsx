import React, { useState, useEffect } from 'react';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching products');
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchProducts(); // Refresh data sau khi xóa
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleSubmit = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      fetchProducts(); // Refresh data sau khi thêm
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      fetchProducts(); // Refresh data sau khi cập nhật
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.productManager}>
      <div className={styles.header}>
        <h2>Quản lý sản phẩm</h2>
        <button className={styles.addButton}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>
                <img src={product.image} alt={product.name} className={styles.productImage} />
              </td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()}đ</td>
              <td>{product.stock}</td>
              <td>
                <button className={styles.editButton}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className={styles.deleteButton} onClick={() => deleteProduct(product._id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
