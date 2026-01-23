"use client";

import { useEffect, useState } from "react";
import Header from "@/src/components/Header/Header";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import LoginPopup from "@/src/components/LoginPopup/LoginPopup";
import useStore from "@/src/store/useStore";
import { useAuth } from "@/src/hooks/useAuth";

const ClientShell = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const loadCartData = useStore((state: any) => state.loadCartData);
  const handleGoogleLogin = useStore((state: any) => state.handleGoogleLogin);
  const setToken = useStore((state: any) => state.setToken);

  // Auto-refresh access token on mount
  useAuth();

  useEffect(() => {
    handleGoogleLogin();
  }, [handleGoogleLogin]);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Header setShowLogin={setShowLogin} />
      <Navbar />
      <main className="app">{children}</main>
      <Footer />
    </>
  );
};

export default ClientShell;
