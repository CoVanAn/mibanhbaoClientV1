"use client";

import useStore from "@/src/store/useStore";
import AccountHero from "./AccountHero";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import AddressSection from "./AddressSection";
import { AccountProvider } from "./AccountContext";
import "./Account.scss";

export default function Page() {
  const token = useStore((state: any) => state.token);

  if (!token) {
    return (
      <div className="account">
        <div className="account-wrapper">
          <div className="account-empty">
            <h2>Đăng nhập để quản lý tài khoản</h2>
            <p>Hãy đăng nhập để xem thông tin hồ sơ, địa chỉ và đơn hàng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccountProvider>
      <div className="account">
        <div className="account-wrapper">
          <AccountHero />

          <div className="account-grid">
            <ProfileSection />
            <PasswordSection />
          </div>

          <AddressSection />
        </div>
      </div>
    </AccountProvider>
  );
}
