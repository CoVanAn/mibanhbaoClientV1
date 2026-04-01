"use client";

import Header from "@/src/components/layouts/header";
import Navbar from "@/src/components/layouts/navbar";
import Footer from "@/src/components/layouts/footer";
import LoginPopup from "@/src/components/common/loginPopup";
import useAuthFlow from "@/src/hooks/useAuthFlow";

const ClientShell = ({ children }: { children: React.ReactNode }) => {
  const { shouldShowLogin, setShowLogin } = useAuthFlow();

  return (
    <>
      {shouldShowLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Header setShowLogin={setShowLogin} />
      <Navbar />
      <main className="app">{children}</main>
      <Footer setShowLogin={setShowLogin} />
    </>
  );
};

export default ClientShell;
