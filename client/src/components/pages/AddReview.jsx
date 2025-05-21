import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail2.module.css';

const AddReview = ({ productId, onAddReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn cần đăng nhập để đánh giá.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Đánh giá thành công!');
        setRating(5);
        setComment('');

        // Gọi hàm onAddReview để cập nhật danh sách đánh giá
        if (onAddReview) {
          onAddReview(data.review); // Giả sử API trả về đánh giá mới
        }
      } else {
        setError(data.message || 'Lỗi khi gửi đánh giá.');
      }
    } catch (error) {
      setError('Lỗi không xác định.');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : ''}`}
        onClick={() => setRating(index + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addReviewForm}>
      <h3>Thêm đánh giá</h3>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <div>
        <label>Đánh giá:</label>
        <div className={styles.starRating}>{renderStars()}</div>
      </div>
      <div>
        <label>Bình luận:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Gửi đánh giá</button>
    </form>
  );
};

export default AddReview;