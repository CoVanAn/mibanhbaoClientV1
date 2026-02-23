"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import useStore from "@/src/store/useStore";
import { AccountProvider } from "./content";
import {
  FiUser,
  FiLock,
  FiMapPin,
  FiShoppingBag,
  FiHome,
} from "react-icons/fi";
import styles from "./layout.module.scss";

const navItems = [
  {
    href: "/account",
    label: "Tổng quan",
    icon: FiHome,
  },
  {
    href: "/account/profile",
    label: "Thông tin tài khoản",
    icon: FiUser,
  },
  {
    href: "/account/password",
    label: "Đổi mật khẩu",
    icon: FiLock,
  },
  {
    href: "/account/address",
    label: "Địa chỉ giao hàng",
    icon: FiMapPin,
  },
  {
    href: "/account/orders",
    label: "Đơn hàng",
    icon: FiShoppingBag,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const token = useStore((state: any) => state.token);

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.emptyCard}>
            <h2>Đăng nhập để quản lý tài khoản</h2>
            <p>Hãy đăng nhập để xem thông tin hồ sơ, địa chỉ và đơn hàng.</p>
            <Link href="/login" className={styles.loginButton}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccountProvider>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.layoutGrid}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <h2>Tài khoản của tôi</h2>
              </div>
              <nav className={styles.nav}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    >
                      <Icon className={styles.navIcon} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </div>
    </AccountProvider>
  );
}
