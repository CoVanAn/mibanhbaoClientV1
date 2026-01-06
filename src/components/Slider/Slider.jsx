"use client";

import React from "react";
import { useState, useEffect } from "react";
import { assets } from "@/src/assets/assets";
import "./Slider.scss";

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
      <div className="slider-section">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slider-item ${
                index === currentSlide ? "active" : ""
              }`}
            >
              <img src={slide} alt={`Slider ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div key={index}>
              <span
                className={`dot ${index === currentSlide ? "active" : ""}`}
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
