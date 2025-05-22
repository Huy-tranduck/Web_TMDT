import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy danh sách banner từ API
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/banners/active');
        
        if (!response.ok) {
          throw new Error('Không thể tải banner');
        }
        
        const data = await response.json();
        
        // Nếu không có banner từ API, sử dụng banner mặc định
        if (data.length === 0) {
          loadDefaultBanners();
        } else {
          // Format dữ liệu banner từ API
          const formattedBanners = data.map(banner => ({
            id: banner._id,
            image: banner.image,
            link: banner.link || '#',
            duration: banner.duration || 3000,
            title: banner.title
          }));
          
          setBannerImages(formattedBanners);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setError(error.message);
        
        // Sử dụng banner mặc định khi lỗi
        loadDefaultBanners();
      }
    };
    
    // Hàm để tải banner mặc định
    const loadDefaultBanners = () => {
      // Tạo mảng banner mặc định
      const defaultBanners = [];
      
      // Thêm banner đầu tiên với GIF
      defaultBanners.push({
        id: 0,
        image: '/images/banners/banner0.gif',
        link: '/promo/0',
        duration: 5000
      });

      // Thêm các banner còn lại
      const numBanner = 9;    
      for (let i = 1; i <= numBanner; i++) {
        defaultBanners.push({
          id: i,
          image: `/images/banners/banner${i}.png`,
          link: `/promo/${i}`,
          duration: 3000
        });
      }
      
      setBannerImages(defaultBanners);
      setLoading(false);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (bannerImages.length === 0) return;

    // Tạo interval cho slideshow
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev === bannerImages.length - 1 ? 0 : prev + 1;
        return nextSlide;
      });
    }, bannerImages[currentSlide]?.duration || 3000);

    return () => clearInterval(timer);
  }, [bannerImages, currentSlide]);

  // Xử lý lỗi đường dẫn ảnh
  const handleImageSrc = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/1050x400?text=Banner+Missing';
    
    // Nếu là URL đầy đủ
    if (imagePath.startsWith('http')) return imagePath;
    
    // Nếu là đường dẫn tương đối
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  // Hiển thị loading hoặc lỗi
  if (loading) return <div className={styles.loading}>Đang tải banner...</div>;
  if (error && bannerImages.length === 0) return <div className={styles.error}>Không thể tải banner</div>;
  if (bannerImages.length === 0) return null;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerSlider}>
        {bannerImages.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            {/* Sử dụng Link nếu là internal link, hoặc a nếu là external link */}
            {banner.link && banner.link.startsWith('/') ? (
              <Link to={banner.link}>
                <img 
                  src={handleImageSrc(banner.image)} 
                  alt={banner.title || `Banner ${index + 1}`} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/1050x400?text=Banner+Error';
                  }}
                />
              </Link>
            ) : (
              <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer">
                <img 
                  src={handleImageSrc(banner.image)} 
                  alt={banner.title || `Banner ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/1050x400?text=Banner+Error';
                  }} 
                />
              </a>
            )}
          </div>
        ))}
        
        {/* Chỉ hiển thị nút điều hướng khi có nhiều hơn 1 banner */}
        {bannerImages.length > 1 && (
          <>
            <div className={styles.controls}>
              <button
                onClick={() => setCurrentSlide(prev => prev === 0 ? bannerImages.length - 1 : prev - 1)}
                className={styles.prevBtn}
                aria-label="Previous banner"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={() => setCurrentSlide(prev => prev === bannerImages.length - 1 ? 0 : prev + 1)}
                className={styles.nextBtn}
                aria-label="Next banner"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className={styles.indicators}>
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Banner;
