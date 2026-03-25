"use client";

import { useState } from "react";
import "./Navbar.scss";
import { assets } from "@/src/assets/assets";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/src/queries/useCart";
import Link from "next/link";
import ProductSearch from "@/src/components/features/search";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { data: cart } = useCart();
  const itemCount = cart?.totalItems || 0;

  return (
    <div className="navbar-container">
      <div className="logo-section">
        <div className="logo-container">
          <Image
            src={assets.logo}
            alt="Logo"
            className="main-logo"
            onClick={() => router.push("/")}
            width={200}
            height={140}
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
            {/* <span onClick={() => router.push("/news")}>Tin tức</span> */}
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
            <ProductSearch />
            <Link href="/cart" className="nav-icon">
              {itemCount > 0 && (
                <span className="badge">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <Image
                src={assets.basket_icon}
                alt="Giỏ hàng"
                width={24}
                height={24}
              />
            </Link>
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
