import React, { useState, useEffect } from 'react';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialProduct = {
    name: '',
    company: '',
    img: '',
    price: '',
    star: 0,
    rateCount: 0,
    promo: { name: '', value: '' },
    detail: {
      screen: '',
      os: '',
      camara: '',
      camaraFront: '',
      cpu: '',
      ram: '',
      rom: '',
      microUSB: '',
      battery: ''
    },
    masp: ''
  };
  const [newProduct, setNewProduct] = useState(initialProduct);


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
      
      // Ensure products is always an array
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Expected array of products but got:', data);
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
      setProducts([]);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Create product data object with all required fields
      const productData = {
        name: newProduct.name,
        company: newProduct.company,
        masp: newProduct.masp,
        price: newProduct.price,
        star: parseInt(newProduct.star) || 0,
        rateCount: parseInt(newProduct.rateCount) || 0,
        img: imagePreview || '', 
        promo: {
          name: newProduct.promo.name || '',
          value: newProduct.promo.value || ''
        },
        detail: {
          screen: newProduct.detail.screen || '',
          os: newProduct.detail.os || '',
          camara: newProduct.detail.camara || '',
          camaraFront: newProduct.detail.camaraFront || '',
          cpu: newProduct.detail.cpu || '',
          ram: newProduct.detail.ram || '',
          rom: newProduct.detail.rom || '',
          microUSB: newProduct.detail.microUSB || '',
          battery: newProduct.detail.battery || ''
        }
      };

      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (response.ok) {
        // Thực hiện các hành động sau khi thêm thành công
        await fetchProducts(); // Đợi fetchProducts hoàn thành
        resetForm(); // Reset form và ẩn nó
        setShowAddForm(false); // Ẩn form
        showNotification('Thêm sản phẩm thành công', 'success');
      } else {
        throw new Error(data.message || 'Lỗi khi tạo sản phẩm');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification(error.message || 'Lỗi khi tạo sản phẩm', 'error');
    }
  };

  // Điều chỉnh lại hàm resetForm để đảm bảo reset toàn bộ state
  const resetForm = () => {
    setNewProduct(initialProduct);
    setImageFile(null);
    setImagePreview('');
  };

   // Xử lý thay đổi input các trường đơn giản
  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý thay đổi input các trường lồng (detail)
  const handleDetailChange = (e) => {
    setNewProduct({
      ...newProduct,
      detail: {
        ...newProduct.detail,
        [e.target.name]: e.target.value
      }
    });
  };

  // Xử lý thay đổi input các trường lồng (promo)
  const handlePromoChange = (e) => {
    setNewProduct({
      ...newProduct,
      promo: {
        ...newProduct.promo,
        [e.target.name]: e.target.value
      }
    });
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

  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(),
      star: product.star.toString(),
      rateCount: product.rateCount.toString()
    });
    setShowEditForm(true);
    setImagePreview(product.img);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const updatedProductData = {
        ...editingProduct,
        img: imagePreview || editingProduct.img,
      };

      const response = await fetch(`http://localhost:5000/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProductData)
      });

      const data = await response.json();

      if (response.ok) {
        await fetchProducts();
        setShowEditForm(false);
        setEditingProduct(null);
        setImagePreview('');
        showNotification('Cập nhật sản phẩm thành công', 'success');
      } else {
        throw new Error(data.message || 'Lỗi khi cập nhật sản phẩm');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification(error.message || 'Lỗi khi cập nhật sản phẩm', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.productManager}>
      <div className={styles.header}>
        <h2>Quản lý sản phẩm</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

            {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Thêm sản phẩm mới</h3>
              <button className={styles.closeButton} onClick={resetForm}>×</button>
            </div>
            <form className={styles.addForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Hãng</label>
                  <input
                    type="text"
                    name="company"
                    value={newProduct.company}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Giá *</label>
                  <input
                    type="text"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Mã sản phẩm</label>
                  <input
                    type="text"
                    name="masp"
                    value={newProduct.masp}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Màn hình</label>
                  <input
                    type="text"
                    name="screen"
                    value={newProduct.detail.screen}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Hệ điều hành</label>
                  <input
                    type="text"
                    name="os"
                    value={newProduct.detail.os}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Camera sau</label>
                  <input
                    type="text"
                    name="camara"
                    value={newProduct.detail.camara}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Camera trước</label>
                  <input
                    type="text"
                    name="camaraFront"
                    value={newProduct.detail.camaraFront}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>CPU</label>
                  <input
                    type="text"
                    name="cpu"
                    value={newProduct.detail.cpu}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>RAM</label>
                  <input
                    type="text"
                    name="ram"
                    value={newProduct.detail.ram}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>ROM</label>
                  <input
                    type="text"
                    name="rom"
                    value={newProduct.detail.rom}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>MicroUSB</label>
                  <input
                    type="text"
                    name="microUSB"
                    value={newProduct.detail.microUSB}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Pin</label>
                  <input
                    type="text"
                    name="battery"
                    value={newProduct.detail.battery}
                    onChange={handleDetailChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Tên khuyến mãi</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.promo.name}
                    onChange={handlePromoChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Giá trị khuyến mãi</label>
                  <input
                    type="text"
                    name="value"
                    value={newProduct.promo.value}
                    onChange={handlePromoChange}
                  />
                </div>
              </div>
              
              <div className={styles.imageUploadSection}>
                <label>Hình ảnh sản phẩm</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="productImage" className={styles.fileLabel}>
                    {imagePreview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                  </label>
                  
                  {imagePreview && (
                    <div className={styles.imagePreviewContainer}>
                      <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                      <button 
                        type="button" 
                        className={styles.removeImageBtn}
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={resetForm}>Hủy</button>
                <button type="submit" className={styles.saveButton}>Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Sửa sản phẩm</h3>
              <button 
                className={styles.closeButton} 
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                  setImagePreview('');
                }}
              >
                ×
              </button>
            </div>
            <form className={styles.addForm} onSubmit={handleUpdateSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Hãng</label>
                  <input
                    type="text"
                    name="company"
                    value={editingProduct.company}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      company: e.target.value
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Giá *</label>
                  <input
                    type="text"
                    name="price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      price: e.target.value
                    })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Mã sản phẩm</label>
                  <input
                    type="text"
                    name="masp" 
                    value={editingProduct.masp}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      masp: e.target.value
                    })}
                  />
                </div>

                {/* Thêm các trường detail */}
                {Object.entries(editingProduct.detail).map(([key, value]) => (
                  <div className={styles.formGroup} key={key}>
                    <label>{key}</label>
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        detail: {
                          ...editingProduct.detail,
                          [key]: e.target.value
                        }
                      })}
                    />
                  </div>
                ))}

                {/* Thêm các trường promo */}
                <div className={styles.formGroup}>
                  <label>Tên khuyến mãi</label>
                  <input
                    type="text"
                    name="promoName"
                    value={editingProduct.promo.name}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      promo: {
                        ...editingProduct.promo,
                        name: e.target.value
                      }
                    })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Giá trị khuyến mãi</label>
                  <input
                    type="text"
                    name="promoValue"
                    value={editingProduct.promo.value}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      promo: {
                        ...editingProduct.promo,
                        value: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className={styles.imageUploadSection}>
                <label>Hình ảnh sản phẩm</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="productImage" className={styles.fileLabel}>
                    {imagePreview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                  </label>
                  
                  {imagePreview && (
                    <div className={styles.imagePreviewContainer}>
                      <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                      <button 
                        type="button" 
                        className={styles.removeImageBtn}
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(editingProduct.img);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProduct(null);
                    setImagePreview('');
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveButton}>
                  Cập nhật sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã SP</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Đánh giá</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.map(product => (
            <tr key={product._id}>
              <td>{product.masp}</td>
              <td>
                <img src={product.img} alt={product.name} className={styles.productImage} />
              </td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                {product.star} sao ({product.rateCount} đánh giá)
              </td>
              <td>
                <button className={styles.editButton} onClick={() => handleEditClick(product)}>
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
