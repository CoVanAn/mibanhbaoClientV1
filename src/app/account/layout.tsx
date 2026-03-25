"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import useStore, { UserSlice } from "@/src/store/user";
import { AccountProvider } from "./content";
import { FiUser, FiLock, FiMapPin, FiShoppingBag } from "react-icons/fi";
import styles from "./layout.module.scss";

const navItems = [
  {
    href: "/account/profile",
    label: "Thông tin tài khoản",
    shortLabel: "Hồ sơ",
    icon: FiUser,
  },
  {
    href: "/account/password",
    label: "Đổi mật khẩu",
    shortLabel: "Mật khẩu",
    icon: FiLock,
  },
  {
    href: "/account/address",
    label: "Địa chỉ giao hàng",
    shortLabel: "Địa chỉ",
    icon: FiMapPin,
  },
  {
    href: "/account/orders",
    label: "Đơn hàng",
    shortLabel: "Đơn hàng",
    icon: FiShoppingBag,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const token = useStore((state: UserSlice) => state.token);

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
                      <span className={styles.navLabel}>{item.label}</span>
                      <span className={styles.navLabelShort}>
                        {item.shortLabel}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </div>
    </AccountProvider>
  );
}
