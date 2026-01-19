"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "./types";
type AccountContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined,
);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within AccountProvider");
  }
  return context;
};
