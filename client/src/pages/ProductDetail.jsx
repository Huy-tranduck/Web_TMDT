import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProductDetail.module.css';
import Header from '../components/common/Header';
import AddReview from '../components/pages/AddReview';
import ProductReviews from '../components/pages/ProductReview';



const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
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
    const token = localStorage.getItem('token');
    console.log("Sản phẩm hiện tại:", product);

    if (!token) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.idchuan}),
      });
      console.log("Dữ liệu gửi lên:", { productId: product.idchuan}) // Kiểm tra dữ liệu gửi lên
      if (response.ok) {
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
      } else {
        throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error(error.message);
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
  <div className={styles.imageSection}>
    <img src={product.img} alt={product.name} />
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
