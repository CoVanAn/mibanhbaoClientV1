"use client";

import { useAccountContext } from "./AccountContext";
import styles from "./page.module.scss";

const AccountHero = () => {
  const { user } = useAccountContext();

  return (
    <header className={styles.accountHero}>
      <div>
        <p className={styles.accountOverline}>Trang tài khoản</p>
        <h1>Xin chào{user?.name ? `, ${user.name}` : ""}!</h1>
      </div>
    </header>
  );
};

export default AccountHero;
