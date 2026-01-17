"use client";

import { useEffect, useState } from "react";
import Header from "@/src/components/Header/Header";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import LoginPopup from "@/src/components/LoginPopup/LoginPopup";
import useStore from "@/src/store/useStore";

const ClientShell = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const loadCartData = useStore((state) => state.loadCartData);
  const handleGoogleLogin = useStore((state) => state.handleGoogleLogin);
  const setToken = useStore((state) => state.setToken);

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
