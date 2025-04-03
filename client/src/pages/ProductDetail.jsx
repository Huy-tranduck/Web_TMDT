import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import styles from './ProductDetail.module.css';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TraGop0 from '../components/home/TraGop0';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Giả lập danh sách sản phẩm
    const fetchProduct = async () => {
      const products = [
        {
          id: "1",
          name: "iPhone 15 Pro Max",
          price: 29990000,
          originalPrice: 34990000,
          image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
          description: "6.7 inch, 8GB RAM, 256GB",
          specifications: {
            "Màn hình": "6.7 inch AMOLED",
            "Hệ điều hành": "iOS 17",
            "Camera sau": "48MP + 12MP",
            "Camera trước": "12MP",
            "CPU": "A17 Bionic",
            "RAM": "8GB",
            "Bộ nhớ trong": "256GB",
            "Dung lượng pin": "4500mAh"
          },
          promotions: [
            "Giảm ngay 2.000.000đ khi thanh toán qua ví điện tử",
            "Tặng kèm ốp lưng chính hãng",
            "Bảo hành 24 tháng"
          ]
        },
        {
          id: "2",
          name: "Samsung Galaxy S23 Ultra",
          price: 23990000,
          originalPrice: 26990000,
          image: "/images/products/s23ultra.jpg",
          description: "6.8 inch, 12GB RAM, 256GB",
          specifications: {
            "Màn hình": "6.8 inch AMOLED",
            "Hệ điều hành": "Android 13",
            "Camera sau": "200MP + 12MP + 10MP",
            "Camera trước": "12MP",
            "CPU": "Snapdragon 8 Gen 2",
            "RAM": "12GB",
            "Bộ nhớ trong": "256GB",
            "Dung lượng pin": "5000mAh"
          },
          promotions: [
            "Giảm ngay 1.500.000đ khi mua online",
            "Tặng kèm tai nghe Bluetooth",
            "Bảo hành 18 tháng"
          ]
        },
        {
          id: "3",
          name: "Xiaomi 13T Pro",
          price: 15990000,
          originalPrice: 17990000,
          image: "/images/products/xiaomi13t.jpg",
          description: "6.67 inch, 12GB RAM, 256GB",
          specifications: {
            "Màn hình": "6.67 inch AMOLED",
            "Hệ điều hành": "Android 13",
            "Camera sau": "108MP + 8MP + 2MP",
            "Camera trước": "20MP",
            "CPU": "Dimensity 9200",
            "RAM": "12GB",
            "Bộ nhớ trong": "256GB",
            "Dung lượng pin": "5000mAh"
          },
          promotions: [
            "Giảm ngay 1.000.000đ khi mua online",
            "Tặng kèm sạc nhanh 120W",
            "Bảo hành 12 tháng"
          ]
        },
        {
          id: "4",
          name: "OPPO Find N3",
          price: 44990000,
          originalPrice: 46990000,
          image: "/images/products/oppon3.jpg",
          description: "7.8 inch, 16GB RAM, 512GB",
          specifications: {
            "Màn hình": "7.8 inch AMOLED",
            "Hệ điều hành": "Android 13",
            "Camera sau": "50MP + 48MP + 32MP",
            "Camera trước": "32MP",
            "CPU": "Snapdragon 8 Gen 2",
            "RAM": "16GB",
            "Bộ nhớ trong": "512GB",
            "Dung lượng pin": "4800mAh"
          },
          promotions: [
            "Giảm ngay 3.000.000đ khi thanh toán qua thẻ tín dụng",
            "Tặng kèm bao da chính hãng",
            "Bảo hành 24 tháng"
          ]
        }
        // Thêm sản phẩm khác nếu cần
      ];

      const product = products.find((p) => p.id === id);
      if (!product) {
        navigate('/404'); // Chuyển hướng đến trang 404 nếu không tìm thấy sản phẩm
      } else {
        setProduct(product);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (!product) {
    return <p>Loading...</p>; // Hiển thị khi đang tải dữ liệu
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem('user'); // Check if user is logged in
    if (!isLoggedIn) {
      alert('Bạn cần đăng nhập để sử dụng giỏ hàng!');
      navigate('/login'); // Redirect to login page
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Trigger a storage event to update the cart count in the header
    window.dispatchEvent(new Event('storage'));

    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  return (
    <>
      <Header />
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
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
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

        {/* Add Featured Products and Trả góp sections */}
        <FeaturedProducts />
        <TraGop0 />
      </div>
    </>
  );
};

export default ProductDetail;
