import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();

  // Dữ liệu mẫu cho sản phẩm
  const product = {
    id,
    name: "Điện thoại Nokia black future",
    price: 999999000,
    originalPrice: 1000000000,
    image: "/images/products/sample.jpg",
    description: "Mô tả chi tiết sản phẩm mẫu.",
    specifications: {
      "Màn hình": "4K, Chống nước, Chống trầy",
      "Hệ điều hành": "iOS + Android song song",
      "Camera sau": "Bộ tứ camera tăng hình",
      "Camera trước": "Chuẩn thế giới 50MP",
      "CPU": "16 nhân 128 bit",
      "RAM": "Không giới hạn",
      "Bộ nhớ trong": "Dùng thoải mái",
      "Thẻ nhớ": "Không cần",
      "Dung lượng pin": "Không cần sạc"
    },
    promotions: [
      "Khách hàng sẽ được giảm 1.000đ khi tới mua trực tiếp tại cửa hàng",
      "Trong hộp có: Sạc, Tai nghe, Sách hướng dẫn, Cây lấy sim, Ốp lưng",
      "Bảo hành chính hãng 12 tháng",
      "1 đổi 1 trong 1 tháng nếu lỗi, đổi sản phẩm tại nhà trong 1 ngày"
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.imageSection}>
        <img src={product.image} alt={product.name} />
      </div>
      <div className={styles.middleSection}>
        <h1>{product.name}</h1>
        <p className={styles.price}>
          {formatPrice(product.price)}{' '}
          {product.originalPrice > product.price && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
        <div className={styles.promotions}>
          <h3>Khuyến mãi</h3>
          <ul>
            {product.promotions.map((promo, index) => (
              <li key={index}>{promo}</li>
            ))}
          </ul>
        </div>
        <button className={styles.addToCartBtn}>
          <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
        </button>
        <p className={styles.deliveryInfo}>Giao trong 1 giờ hoặc nhận tại cửa hàng</p>
      </div>
      <div className={styles.infoSection}>
        <h3>Thông số kỹ thuật</h3>
        <table>
          <tbody>
            {Object.entries(product.specifications).map(([key, value]) => (
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetail;
