'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

const slides = [
  {
    id: 1,
    title: 'Elevate Your Game',
    subtitle: 'Premium badminton equipment for enthusiasts',
    buttonText: 'Shop Rackets',
    buttonLink: '/shop',
    image: '/images/court1.png',
  },
  {
    id: 2,
    title: 'Championship Performance',
    subtitle: 'Tournament-grade rackets trusted by professionals',
    buttonText: 'Explore Collection',
    buttonLink: '/shop',
    image: '/images/court2.png',
  },
  {
    id: 3,
    title: 'Precision Engineering',
    subtitle: 'Advanced technology for ultimate control and power',
    buttonText: 'Discover More',
    buttonLink: '/shop',
    image: '/images/court3.png',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.slides}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <div
              className={styles.slideBackground}
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className={styles.overlay}></div>
            <div className={styles.slideContent}>
              <h1 className={styles.slideTitle}>{slide.title}</h1>
              <p className={styles.slideSubtitle}>{slide.subtitle}</p>
              <Link href={slide.buttonLink} className={styles.slideButton}>
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide}>
        ‹
      </button>
      <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide}>
        ›
      </button>

      <div className={styles.controls}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
