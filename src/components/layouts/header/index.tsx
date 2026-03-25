"use client";

import { useState } from "react";
import "./Header.scss";
import useStore, { UserSlice } from "@/src/store/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmModal from "@/src/components/common/ConfirmModal";

type HeaderProps = {
  setShowLogin: (isOpen: boolean) => void;
};

const Header = ({ setShowLogin }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const token = useStore((state: UserSlice) => state.token);
  const clearToken = useStore((state: UserSlice) => state.clearToken);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);
  const router = useRouter();

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
      console.error("Logout error:", error);
    } finally {
      // Clear token from memory
      clearToken();

      // Redirect to home
      router.push("/");
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-left">
          <span>Hotline: 0942 5533 42</span>
          <span>Email: hotro@mibanhbao.vn</span>
        </div>
        <div className="header-right">
          {!isInitialized ? (
            // Show loading or placeholder while checking session
            <span className="header-login-btn" style={{ opacity: 0.5 }}>
              Đang tải...
            </span>
          ) : !token ? (
            <>
              <span
                onClick={() => setShowLogin(true)}
                className="header-login-btn"
              >
                Đăng nhập
              </span>
              <span
                className="header-login-btn"
                onClick={() => setShowLogin(true)}
              >
                Đăng ký
              </span>
            </>
          ) : (
            <>
              <Link href="/account" className="header-login-btn">
                Tài khoản
              </Link>
              <span className="login-btn" onClick={handleLogout}>
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
