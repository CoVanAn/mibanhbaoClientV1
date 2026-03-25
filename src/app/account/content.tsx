"use client";

import { createContext, useContext, ReactNode } from "react";
import { useProfile } from "@/src/queries/useAccount";
import { User } from "./types";

type AccountContextValue = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined,
);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, error } = useProfile();

  return (
    <AccountContext.Provider
      value={{ user: user || null, isLoading, error: error as Error | null }}
    >
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
