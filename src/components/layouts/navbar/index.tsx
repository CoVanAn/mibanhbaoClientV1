"use client";

import { useState } from "react";
import styles from "./Navbar.module.scss";
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
    <div className={styles.navbarContainer}>
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <Link href="/" aria-label="Về trang chủ">
            <Image
              src={assets.logo}
              alt="Logo"
              className={styles.mainLogo}
              width={200}
              height={140}
            />
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      {/* <hr style={{ border: "1px solid #eee" }} /> */}
      <div className={styles.navBar}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navItem}>
                {item.label}
              </Link>
            ))}
          </div>
          <div
            className={styles.hamburgerMenu}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={styles.navRight}>
            {/* Menu hamburger cho tablet/mobile */}
            <ProductSearch />
            <Link href="/cart" className={styles.navIcon}>
              {itemCount > 0 && (
                <span className={styles.badge}>
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
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h3>Menu</h3>
            <span className={styles.closeBtn} onClick={closeSidebar}>
              ×
            </span>
          </div>
          <div className={styles.sidebarMenu}>
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
        <div className={styles.sidebarOverlay} onClick={closeSidebar}></div>
      )}
    </div>
  );
};

export default Navbar;
