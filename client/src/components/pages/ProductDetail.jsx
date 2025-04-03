import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Add this
import LoginModal from '../common/LoginModal'; // Add this
import ProductCard from '../home/ProductCard';
import styles from './ProductDetail.module.css';
import featuredStyles from '../home/FeaturedProducts.module.css';

const mockProduct = {
  id: 1,
  name: 'Điện thoại Nokia black future',
  image: '/images/products/nokia_black_future.jpg',
  price: '999,999,000',
  rating: 5,
  reviews: 9999,
  promotions: [
    'Khách hàng sẽ được giảm 1.000₫ khi tới mua trực tiếp tại cửa hàng',
  ],
  warranty: [
    'Trong hộp có: Sạc, Tai nghe, Sách hướng dẫn, Cây lấy sim, Ốp lưng',
    'Bảo hành chính hãng 12 tháng.',
    '1 đổi 1 trong 1 tháng nếu lỗi, đổi sản phẩm tại nhà trong 1 ngày.',
  ],
  specifications: {
    screen: '4K, Chống nước, Chống trầy',
    os: 'iOS + Android song song',
    rearCamera: 'Bộ tứ camera tàng hình',
    frontCamera: 'Chuẩn thế giới 50MP',
    cpu: '16 nhân 128 bit',
    ram: 'Không giới hạn',
    storage: 'Dùng thoải mái',
    memoryCard: 'Không cần',
    battery: 'Không cần sạc',
  },
};

const mockRelatedProducts = [
  { id: 2, name: 'iPhone 13 Pro Max', price: '30,990,000', image: '/images/products/iphone13.jpg' },
  { id: 3, name: 'Xiaomi Mi 11', price: '15,990,000', image: '/images/products/mi11.jpg' },
  { id: 4, name: 'Oppo Find X3', price: '18,990,000', image: '/images/products/findx3.jpg' },
  { id: 5, name: 'Vivo X60 Pro', price: '16,990,000', image: '/images/products/x60pro.jpg' },
  { id: 6, name: 'Realme GT', price: '12,990,000', image: '/images/products/realmegt.jpg' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Add this
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false); // Add this

  useEffect(() => {
    // Simulate fetching product details
    setProduct(mockProduct);

    // Simulate fetching related products
    setRelatedProducts(mockRelatedProducts);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Add to cart logic
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };

    const existingCart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.productId === product.id);

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem(`cart_${user.id}`, JSON.stringify(existingCart));
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        <div className={styles.productInfo}>
          <div className={styles.imageSection}>
            <img src={product.image} alt={product.name} />
          </div>
          <div className={styles.detailsSection}>
            <h1>{product.name}</h1>
            <p className={styles.price}>
              {product.price}₫ <span className={styles.discount}>Giảm 1.000₫</span>
            </p>
            <div className={styles.promotions}>
              <h3>KHUYẾN MÃI</h3>
              <ul>
                {product.promotions.map((promo, index) => (
                  <li key={index}>{promo}</li>
                ))}
              </ul>
            </div>
            <div className={styles.warranty}>
              <ul>
                {product.warranty.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <button 
              className={styles.addToCart} 
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className={styles.specificationsSection}>
            <h3>Thông số kỹ thuật</h3>
            <ul>
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className={`${featuredStyles.featuredProducts} ${styles.relatedProducts}`}>
        <div className={featuredStyles.container}>
          <h2 className={featuredStyles.sectionTitle}>Bạn có thể thích</h2>
          <div className={featuredStyles.productGrid}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          message="Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
        />
      )}
    </div>
  );
};

export default ProductDetail;
