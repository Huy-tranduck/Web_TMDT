import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import styles from './ProductDetail.module.css';
import Header from '../components/common/Header';
import AddReview from '../components/pages/AddReview';
import ProductReviews from '../components/pages/ProductReview';



const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specifications, setSpecifications] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/detail/${id}`);
        const data = await response.json();
        console.log("Dữ liệu sản phẩm:", data); // Kiểm tra dữ liệu sản phẩm
        if (data.success) {
          setProduct(data.product);
          setSpecifications(data.product.specifications);
        } else {
          setError(data.message);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <p>Đang tải thông tin sản phẩm...</p>; // Hiển thị khi đang tải dữ liệu
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (product) {
      const success = await addToCart(product.idchuan);
      if (success) {
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
      }
    }
  };
  const handleReviewAdded = () => {
    setRefreshReviews(prev => !prev); // Đảo ngược để kích hoạt useEffect bên ProductReviews
  };
  return (
    <>
      <Header />
      <div className={styles.productDetail}>
  {/* Phần hiển thị sản phẩm */}
  {/* // Sửa dòng 67 - đổi product.imgage thành product.image hoặc product.img */}

<div className={styles.imageSection}>
  <img 
    src={
      (product.image || product.img) && 
      !(product.image || product.img).startsWith('http') ? 
        `http://localhost:3000/${product.image || product.img}` : 
        (product.image || product.img)
    }
    alt={product.name}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = 'https://via.placeholder.com/300x300?text=Hình+ảnh+không+có+sẵn';
    }}
  />
</div>
  <div className={styles.middleSection}>
    <h1>{product.name}</h1>
    <div className={styles.priceBox}>
      <span className={styles.price}>{product.price}₫</span>
      {product.promotion && product.promotion.name === 'giamgia' && (
        <span className={styles.discount}>
          Giảm {product.promotion.value}₫
        </span>
      )}
    </div>

    <div className={styles.promoInfo}>
      <h3>Khuyến mãi</h3>
      <p>Khách hàng sẽ được thử máy miễn phí tại cửa hàng. Có thể đổi trả lỗi trong vòng 2 tháng.</p>
    </div>

    <div className={styles.warranty}>
      <h3>Thông tin & Bảo hành</h3>
      <ul>
        <li>Trong hộp có: Sạc, Tai nghe, Sách hướng dẫn, Cây lấy sim, Ốp lưng</li>
        <li>Bảo hành chính hãng 12 tháng</li>
        <li>1 đổi 1 trong 1 tháng nếu lỗi, đổi sản phẩm tại nhà trong 1 ngày</li>
      </ul>
    </div>

    <button className={styles.addToCartButton} onClick={handleAddToCart}>
      Thêm vào giỏ hàng
    </button>
  </div>

  <div className={styles.specificationSection}>
    <h3>Thông số kỹ thuật</h3>
    <table className={styles.specTable}>
      <tbody>
        {Object.entries(specifications).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Phần đánh giá và nhận xét */}
  <div className={styles.bottomContent}>
    <ProductReviews productId={product.idchuan} refresh={refreshReviews} />
    <AddReview productId={product.idchuan} onAddReview={handleReviewAdded} />
  </div>


</div>
    </>
  );
};

export default ProductDetail;
