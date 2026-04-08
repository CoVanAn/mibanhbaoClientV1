"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./Header.module.scss";
import useStore, { UserSlice } from "@/src/store/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmModal from "@/src/components/common/ConfirmModal";
import logger from "@/src/lib/logger";

type HeaderProps = {
  setShowLogin: (isOpen: boolean) => void;
};

const Header = ({ setShowLogin }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const token = useStore((state: UserSlice) => state.token);
  const clearToken = useStore((state: UserSlice) => state.clearToken);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);

    try {
      // Call logout API to clear HttpOnly cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      logger.warn("[header] Logout request failed", error);
    } finally {
      // Clear token from memory
      clearToken();

      // Drop user-scoped caches to prevent stale data after auth state changes
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["account"] });
      queryClient.removeQueries({ queryKey: ["orders"] });

      // Redirect to home
      router.push("/");
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <span>Hotline: 0942 5533 42</span>
          <span>Email: hotro@mibanhbao.vn</span>
        </div>
        <div className={styles.headerRight}>
          {!isInitialized ? (
            // Show loading or placeholder while checking session
            <span className={styles.headerLoginBtn} style={{ opacity: 0.5 }}>
              Đang tải...
            </span>
          ) : !token ? (
            <>
              <span
                onClick={() => setShowLogin(true)}
                className={styles.headerLoginBtn}
              >
                Đăng nhập
              </span>
              <span
                className={styles.headerLoginBtn}
                onClick={() => setShowLogin(true)}
              >
                Đăng ký
              </span>
            </>
          ) : (
            <>
              <Link href="/account" className={styles.headerLoginBtn}>
                Tài khoản
              </Link>
              <span className={styles.loginBtn} onClick={handleLogout}>
                Đăng xuất
              </span>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất tài khoản?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Header;
