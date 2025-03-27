import React, { useState, useEffect } from 'react';
import styles from './Banner.module.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    // Tạo mảng banner
    const banners = [];
    // Thêm banner đầu tiên với GIF
    banners.push({
      id: 0,
      image: '/images/banners/banner0.gif',
      link: '/promo/0',
      duration: 5000 // Thời gian hiển thị dài hơn cho GIF
    });

    // Thêm các banner còn lại bằng vòng lặp
    const numBanner = 9;    
    for (let i = 1; i <= numBanner; i++) {
      banners.push({
        id: i,
        image: `/images/banners/banner${i}.png`,
        link: `/promo/${i}`,
        duration: 3000 // Thời gian hiển thị chuẩn cho ảnh thường
      });
    }

    setBannerImages(banners);
  }, []);

  useEffect(() => {
    if (bannerImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev === bannerImages.length - 1 ? 0 : prev + 1;
        return nextSlide;
      });
    }, bannerImages[currentSlide]?.duration || 3000);

    return () => clearInterval(timer);
  }, [bannerImages, currentSlide]);

  if (bannerImages.length === 0) return null;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerSlider}>
        {bannerImages.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <a href={banner.link}>
              <img src={banner.image} alt={`Banner ${banner.id}`} />
            </a>
          </div>
        ))}
        
        <div className={styles.controls}>
          <button
            onClick={() => setCurrentSlide(prev => prev === 0 ? bannerImages.length - 1 : prev - 1)}
            className={styles.prevBtn}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={() => setCurrentSlide(prev => prev === bannerImages.length - 1 ? 0 : prev + 1)}
            className={styles.nextBtn}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
