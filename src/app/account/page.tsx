"use client";

import Link from "next/link";
import { useAccountContext } from "./content";
import OrdersSection from "./orders-section";
import {
  FiUser,
  FiLock,
  FiMapPin,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import styles from "./page.module.scss";

export default function Page() {
  const { user } = useAccountContext();

  return (
    <div className={styles.overview}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <p className={styles.overline}>Trang tài khoản</p>
        <h1>Xin chào{user?.name ? `, ${user.name}` : ""}!</h1>
        <p className={styles.subtitle}>
          Quản lý thông tin tài khoản, địa chỉ và đơn hàng của bạn.
        </p>
      </header>

      {/* Quick Actions Grid */}
      <div className={styles.quickActions}>
        <Link href="/account/profile" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <FiUser />
          </div>
          <div className={styles.actionContent}>
            <h3>Thông tin tài khoản</h3>
            <p>Cập nhật họ tên, email và số điện thoại</p>
          </div>
          <FiArrowRight className={styles.actionArrow} />
        </Link>

        <Link href="/account/password" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <FiLock />
          </div>
          <div className={styles.actionContent}>
            <h3>Đổi mật khẩu</h3>
            <p>Thay đổi mật khẩu để bảo mật tài khoản</p>
          </div>
          <FiArrowRight className={styles.actionArrow} />
        </Link>

        <Link href="/account/address" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <FiMapPin />
          </div>
          <div className={styles.actionContent}>
            <h3>Địa chỉ giao hàng</h3>
            <p>Quản lý địa chỉ nhận hàng của bạn</p>
          </div>
          <FiArrowRight className={styles.actionArrow} />
        </Link>

        <Link href="/account/orders" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <FiShoppingBag />
          </div>
          <div className={styles.actionContent}>
            <h3>Đơn hàng</h3>
            <p>Xem lịch sử và trạng thái đơn hàng</p>
          </div>
          <FiArrowRight className={styles.actionArrow} />
        </Link>
      </div>

      {/* Recent Orders */}
      <OrdersSection />
    </div>
  );
}
