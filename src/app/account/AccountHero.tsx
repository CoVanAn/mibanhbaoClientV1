"use client";

import { useAccountContext } from "./AccountContext";

const AccountHero = () => {
  const { user } = useAccountContext();

  return (
    <header className="account-hero">
      <div>
        <h1>Xin chào{user?.name ? `, ${user.name}` : ""}!</h1>
      </div>
    </header>
  );
};

export default AccountHero;
