"use client";

import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { assets } from "@/src/assets/assets";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slides = [assets.slider_1, assets.slider_2];
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      {/* Top Bar */}
      {/* <div className='top-bar'>
        <div className='top-bar-container'>
          <div className='top-bar-left'>
            <span>Hotline: 0942 5533 42</span>
            <span>Email: hotro@mibanhbao.vn</span>
          </div>
          <div className='top-bar-right'>
            <span>Tài khoản</span>
            <span>Đăng xuất</span>
            <span>Liên hệ</span>
          </div>
        </div>
      </div> */}

      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          <img
            src={assets.logo}
            alt="Logo"
            className="main-logo"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <hr style={{ border: "1px solid #eee" }} />
      <div className="nav-bar">
        <div className="nav-container">
          <div className="nav-left">
            <span onClick={() => router.push("/")}>Trang chủ</span>
            <span onClick={() => router.push("/about")}>Giới thiệu</span>
            <span onClick={() => router.push("/products")}>Sản phẩm</span>
            <span onClick={() => router.push("/news")}>Tin tức</span>
            <span onClick={() => router.push("/contact")}>Liên hệ</span>
          </div>
          <div
            className="hamburger-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="nav-right">
            {/* Menu hamburger cho tablet/mobile */}
            <div className="nav-icon">
              <img src={assets.search_icon} alt="Tìm kiếm" />
            </div>
            <div className="nav-icon">
              <img src={assets.basket_icon} alt="Giỏ hàng" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar cho tablet/mobile */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h3>Menu</h3>
            <span className="close-btn" onClick={() => setSidebarOpen(false)}>
              ×
            </span>
          </div>
          <div className="sidebar-menu">
            <span
              onClick={() => {
                setSidebarOpen(false);
                router.push("/");
              }}
            >
              Trang chủ
            </span>
            <span
              onClick={() => {
                setSidebarOpen(false);
                router.push("/about");
              }}
            >
              Giới thiệu
            </span>
            <span
              onClick={() => {
                setSidebarOpen(false);
                router.push("/products");
              }}
            >
              Sản phẩm
            </span>
            <span
              onClick={() => {
                setSidebarOpen(false);
                router.push("/contact");
              }}
            >
              Liên hệ
            </span>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* <div className='slider-section'>
        <div className='slider-container'>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slider-item ${index === currentSlide ? 'active' : ''}`}
            >
              <img src={slide} alt={`Slider ${index + 1}`} />
            </div>
          ))}

          <div className='slider-dots'>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div> */}

      {/* Brand Section */}
      {/* <div className='brand-section'>
        <div className='brand-container'>
          <img src={assets.img_brand_1} alt="Brand 1" />
          <img src={assets.img_brand_2} alt="Brand 2" />
          <img src={assets.img_brand_3} alt="Brand 3" />
          <img src={assets.img_brand_4} alt="Brand 4" />
          <img src={assets.img_brand_5} alt="Brand 5" />
          <img src={assets.img_brand_6} alt="Brand 6" />
        </div>
      </div> */}
    </>
  );
};

export default Navbar;
