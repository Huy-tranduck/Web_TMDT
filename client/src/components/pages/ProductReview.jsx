import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail2.module.css';

const ProductReviews = ({productId,refresh}) => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // Điểm trung bình
  const [totalReviews, setTotalReviews] = useState(0); // Tổng số lượt đánh giá
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`);
        const data = await response.json();
        setReviews(data.reviews);

        // Tính điểm trung bình và tổng số lượt đánh giá
        const totalRatings = data.reviews.reduce((acc, review) => acc + review.rating, 0);
        const total = data.reviews.length;
        setAverageRating(total > 0 ? (totalRatings / total).toFixed(1) : 0);
        setTotalReviews(total);
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
      }
    };

    fetchReviews();
  }, [productId, refresh]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={styles.reviews}>
      <h3>Đánh giá sản phẩm</h3>
      <div className={styles.ratingSummary}>
        <strong>Điểm trung bình: {averageRating} / 5★</strong>
        <p>Tổng số lượt đánh giá: {totalReviews}</p>
      </div>
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className={styles.review}>
            <strong>{review.username}</strong>
            <div className={styles.starRating}>{renderStars(review.rating)}</div>
            <p>{review.comment}</p>
            <small>{new Date(review.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};
export default ProductReviews;