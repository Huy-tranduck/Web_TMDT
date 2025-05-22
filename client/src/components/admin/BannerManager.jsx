import React, { useState, useEffect } from 'react';
import styles from './BannerManager.module.css';
import Toast from '../common/Toast';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingBanner, setEditingBanner] = useState(null);
  
  const [newBanner, setNewBanner] = useState({
    title: '',
    link: '',
    duration: 3000,
    isActive: true,
    order: 0
  });

  // Tải danh sách banner
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/banners', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách banner');
      }
      
      const data = await response.json();
      setBanners(data);
      
    } catch (error) {
      setError(error.message);
      showNotification('Lỗi khi tải danh sách banner', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tải banner khi component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Hiển thị thông báo
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Xử lý thay đổi ảnh
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

  // Reset form thêm mới
  const resetForm = () => {
    setNewBanner({
      title: '',
      link: '',
      duration: 3000,
      isActive: true,
      order: 0
    });
    setImageFile(null);
    setImagePreview('');
  };

  // Xử lý thay đổi input trong form thêm mới
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBanner({
      ...newBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Xử lý thay đổi input trong form chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingBanner({
      ...editingBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Xử lý thêm banner
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!imageFile) {
        showNotification('Vui lòng chọn ảnh cho banner', 'error');
        return;
      }
      
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Thêm thông tin banner vào formData
      formData.append('title', newBanner.title);
      formData.append('link', newBanner.link);
      formData.append('duration', newBanner.duration);
      formData.append('isActive', newBanner.isActive);
      formData.append('order', newBanner.order);
      formData.append('image', imageFile);
      
      const response = await fetch('http://localhost:5000/api/admin/banners', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification('Thêm banner thành công', 'success');
        fetchBanners();
        resetForm();
        setShowAddForm(false);
      } else {
        throw new Error(data.message || 'Lỗi khi tạo banner');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  // Xử lý chỉnh sửa banner
  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setImagePreview(banner.image.startsWith('/') ? `http://localhost:3000${banner.image}` : banner.image);
    setShowEditForm(true);
  };

  // Xử lý cập nhật banner
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Thêm thông tin banner vào formData
      formData.append('title', editingBanner.title);
      formData.append('link', editingBanner.link);
      formData.append('duration', editingBanner.duration);
      formData.append('isActive', editingBanner.isActive);
      formData.append('order', editingBanner.order);
      
      // Nếu có chọn ảnh mới, thêm vào formData
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await fetch(`http://localhost:5000/api/admin/banners/${editingBanner._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification('Cập nhật banner thành công', 'success');
        fetchBanners();
        setShowEditForm(false);
        setEditingBanner(null);
        setImageFile(null);
        setImagePreview('');
      } else {
        throw new Error(data.message || 'Lỗi khi cập nhật banner');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  // Xử lý xóa banner
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/banners/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          showNotification('Xóa banner thành công', 'success');
          fetchBanners();
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Lỗi khi xóa banner');
        }
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  // Xử lý thay đổi trạng thái active
  const toggleBannerStatus = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      
      if (response.ok) {
        showNotification(`Banner ${isActive ? 'đã bị ẩn' : 'đã được hiển thị'}`, 'success');
        fetchBanners();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Lỗi khi thay đổi trạng thái banner');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  // Xử lý hình ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100x50?text=Banner+Trống';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  if (error) return <div className={styles.error}>Lỗi: {error}</div>;

  return (
    <div className={styles.bannerManager}>
      <div className={styles.header}>
        <h2>Quản lý Banner</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus"></i> Thêm Banner mới
        </button>
      </div>

      {notification.show && (
        <Toast message={notification.message} type={notification.type} />
      )}

      {/* Bảng danh sách banner */}
      <div className={styles.bannerList}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Link</th>
              <th>Thời gian (ms)</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 ? (
              banners.map(banner => (
                <tr key={banner._id}>
                  <td>
                    <img
                      src={getImageUrl(banner.image)}
                      alt={banner.title}
                      className={styles.bannerImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x50?text=Banner+Error';
                      }}
                    />
                  </td>
                  <td>{banner.title}</td>
                  <td>{banner.link}</td>
                  <td>{banner.duration}</td>
                  <td>{banner.order}</td>
                  <td>
                    <span
                      className={`${styles.status} ${banner.isActive ? styles.active : styles.inactive}`}
                      onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                      title={banner.isActive ? 'Nhấp để ẩn' : 'Nhấp để hiện'}
                    >
                      {banner.isActive ? 'Đang hiện' : 'Đang ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(banner)}
                        title="Sửa banner"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(banner._id)}
                        title="Xóa banner"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  Không có banner nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form thêm banner */}
      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Thêm Banner mới</h3>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form className={styles.addForm} onSubmit={handleAddSubmit}>
              <div className={styles.formGroup}>
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={newBanner.title}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tiêu đề banner"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Link</label>
                <input
                  type="text"
                  name="link"
                  value={newBanner.link}
                  onChange={handleChange}
                  placeholder="Nhập URL khi click vào banner"
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Thời gian hiển thị (ms)</label>
                  <input
                    type="number"
                    name="duration"
                    min="1000"
                    step="500"
                    value={newBanner.duration}
                    onChange={handleChange}
                    placeholder="Nhập thời gian hiển thị"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Thứ tự</label>
                  <input
                    type="number"
                    name="order"
                    min="0"
                    value={newBanner.order}
                    onChange={handleChange}
                    placeholder="Nhập số thứ tự"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newBanner.isActive}
                    onChange={handleChange}
                  />
                  Hiển thị banner
                </label>
              </div>
              
              <div className={styles.imageUploadSection}>
                <label>Hình ảnh banner</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="bannerImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="bannerImage" className={styles.fileLabel}>
                    {imagePreview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                  </label>
                  
                  {imagePreview && (
                    <div className={styles.imagePreviewContainer}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={styles.imagePreview}
                      />
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
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveButton}>
                  Thêm banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form sửa banner */}
      {showEditForm && editingBanner && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Chỉnh sửa Banner</h3>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowEditForm(false);
                  setEditingBanner(null);
                  setImageFile(null);
                  setImagePreview('');
                }}
              >
                ×
              </button>
            </div>
            <form className={styles.addForm} onSubmit={handleUpdateSubmit}>
              <div className={styles.formGroup}>
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={editingBanner.title}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Link</label>
                <input
                  type="text"
                  name="link"
                  value={editingBanner.link}
                  onChange={handleEditChange}
                  placeholder="Nhập URL khi click vào banner"
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Thời gian hiển thị (ms)</label>
                  <input
                    type="number"
                    name="duration"
                    min="1000"
                    step="500"
                    value={editingBanner.duration}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Thứ tự</label>
                  <input
                    type="number"
                    name="order"
                    min="0"
                    value={editingBanner.order}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editingBanner.isActive}
                    onChange={handleEditChange}
                  />
                  Hiển thị banner
                </label>
              </div>
              
              <div className={styles.imageUploadSection}>
                <label>Hình ảnh banner</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="editBannerImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="editBannerImage" className={styles.fileLabel}>
                    {imagePreview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                  </label>
                  
                  {imagePreview && (
                    <div className={styles.imagePreviewContainer}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={styles.imagePreview}
                      />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => {
                          setImageFile(null);
                          // Khôi phục ảnh gốc
                          setImagePreview(getImageUrl(editingBanner.image));
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
                    setEditingBanner(null);
                    setImageFile(null);
                    setImagePreview('');
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveButton}>
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hiển thị thông tin thêm */}
      <div className={styles.infoSection}>
        <p>
          <i className="fas fa-info-circle"></i> Các banner sẽ hiển thị theo thứ tự từ thấp đến cao.
          Nhấp vào trạng thái để ẩn/hiện banner nhanh chóng.
        </p>
      </div>
    </div>
  );
};

export default BannerManager;