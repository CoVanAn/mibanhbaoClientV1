"use client";

import useStore from "@/src/store/useStore";
import AccountHero from "./hero";
import ProfileSection from "./profile";
import PasswordSection from "./password";
import AddressSection from "./address";
import { AccountProvider } from "./content";
import styles from "./page.module.scss";

export default function Page() {
  const token = useStore((state: any) => state.token);

  if (!token) {
    return (
      <div className={styles.account}>
        <div className={styles.accountWrapper}>
          <div className={styles.accountEmptyCard}>
            <h2>Đăng nhập để quản lý tài khoản</h2>
            <p>Hãy đăng nhập để xem thông tin hồ sơ, địa chỉ và đơn hàng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccountProvider>
      <div className={styles.account}>
        <div className={styles.accountWrapper}>
          <AccountHero />
          <div className={styles.accountGrid}>
            <ProfileSection />
            <PasswordSection />
          </div>
          <AddressSection />
        </div>
      </div>
    </AccountProvider>
  );
}
