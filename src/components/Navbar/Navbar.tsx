"use client";

import { useState, useEffect } from "react";
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
    <div className="navbar-container">
      <div className="logo-section">
        <div className="logo-container">
          <img
            src={assets.logo}
            alt="Logo"
            className="main-logo"
            onClick={() => router.push("/")}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      {/* <hr style={{ border: "1px solid #eee" }} /> */}
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
    </div>
  );
};

export default Navbar;
