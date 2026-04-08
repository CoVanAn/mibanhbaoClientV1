"use client";

import { useState, useEffect } from "react";
import { assets } from "@/src/assets/assets";
import Image from "next/image";
import styles from "./Slider.module.scss";

const Slider = () => {
  const slides = [assets.slider_1, assets.slider_2];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div>
      <div className={styles.sliderSection}>
        <div className={styles.sliderContainer}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.sliderItem} ${index === currentSlide ? styles.active : ""} ${index === 0 ? styles.first : ""}`}
            >
              <Image
                src={slide}
                alt={`Slider ${index + 1}`}
                width={1400}
                height={560}
              />
            </div>
          ))}
        </div>
        <div className={styles.sliderDots}>
          {slides.map((_, index) => (
            <div key={index}>
              <span
                className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
