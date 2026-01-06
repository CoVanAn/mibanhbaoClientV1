"use client";

import { useState } from "react";
import StoreContextProvider from "@/src/context/StoreContext";
import Header from "@/src/components/Header/Header";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer/Footer";
import LoginPopup from "@/src/components/LoginPopup/LoginPopup";

const ClientShell = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Header setShowLogin={setShowLogin} />
      <Navbar />
      <main className="app">{children}</main>
      <Footer />
    </StoreContextProvider>
  );
};

export default ClientShell;
