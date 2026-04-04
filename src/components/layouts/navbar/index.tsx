"use client";

import { useState } from "react";
import "./Navbar.scss";
import { assets } from "@/src/assets/assets";
import Image from "next/image";
import { useCart } from "@/src/queries/useCart";
import Link from "next/link";
import ProductSearch from "@/src/components/features/search";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Liên hệ", href: "/contact" },
] as const;

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: cart } = useCart();
  const itemCount = cart?.totalItems || 0;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="navbar-container">
      <div className="logo-section">
        <div className="logo-container">
          <Link href="/" aria-label="Về trang chủ">
            <Image
              src={assets.logo}
              alt="Logo"
              className="main-logo"
              width={200}
              height={140}
            />
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      {/* <hr style={{ border: "1px solid #eee" }} /> */}
      <div className="nav-bar">
        <div className="nav-container">
          <div className="nav-left">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="item">
                {item.label}
              </Link>
            ))}
          </div>
          <div
            className="hamburger-menu"
            onClick={() => setSidebarOpen((prev) => !prev)}
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
            <span className="close-btn" onClick={closeSidebar}>
              ×
            </span>
          </div>
          <div className="sidebar-menu">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                onClick={closeSidebar}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default Navbar;
