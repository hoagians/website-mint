"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { BLUR_IMG, LEFT_IMG, RIGHT_IMG } from "../app/lib/images";
import styles from "../styles/carousel.module.css";

const isMobileDevice = (): boolean => {
  return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const Carousel: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [dimension, setDimension] = useState<number>(320);

  const images = useMemo(
    () => [
      "/images/1.webp",
      "/images/2.webp",
      "/images/3.webp",
      "/images/4.webp",
      "/images/5.webp",
      "/images/6.webp",
      "/images/7.webp",
      "/images/8.webp",
      "/images/9.webp",
      "/images/10.webp",
    ],
    []
  );

  useEffect(() => {
    setDimension(isMobileDevice() ? 320 : 420);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentImageIndex]);

  return (
    <div className={styles.carousel}>
      <button onClick={prevImage} className={styles.prevButton}>
        <Image src={LEFT_IMG} alt="Previous" width={30} height={30} priority={true} />
      </button>
      <Image
        className={styles.images}
        src={images[currentImageIndex]}
        alt={`Image ${currentImageIndex + 1}`}
        width={dimension}
        height={dimension}
        priority={true}
        placeholder="blur"
        blurDataURL={BLUR_IMG}
      />
      <button onClick={nextImage} className={styles.nextButton}>
        <Image src={RIGHT_IMG} alt="Next" width={30} height={30} priority={true} />
      </button>
      <div className={styles.indicators}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ""}`}
            onClick={() => goToImage(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
