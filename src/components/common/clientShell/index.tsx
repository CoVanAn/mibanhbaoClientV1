"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Header from "@/src/components/layouts/header";
import Navbar from "@/src/components/layouts/navbar";
import Footer from "@/src/components/layouts/footer";
import LoginPopup from "@/src/components/common/loginPopup";
import useStore from "@/src/store/useStore";
import { useAuth } from "@/src/hooks/useAuth";

const ClientShell = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const handleGoogleLogin = useStore((state: any) => state.handleGoogleLogin);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Auto-refresh access token on mount
  useAuth();

  useEffect(() => {
    handleGoogleLogin();
  }, [handleGoogleLogin]);

  // Listen for Google login success to refetch cart and redirect
  useEffect(() => {
    const handleGoogleLoginSuccess = () => {
      console.log("[ClientShell] Google login success detected, refetching cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      // Redirect to account page to show user info
      setTimeout(() => {
        router.push("/account");
      }, 500);
    };

    window.addEventListener("google-login-success", handleGoogleLoginSuccess);
    return () => {
      window.removeEventListener("google-login-success", handleGoogleLoginSuccess);
    };
  }, [queryClient, router]);

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
