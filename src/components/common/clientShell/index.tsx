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
import { useMergeGuestCart } from "@/src/queries/useCart";

const ClientShell = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const handleGoogleLogin = useStore((state: any) => state.handleGoogleLogin);
  const queryClient = useQueryClient();
  const router = useRouter();
  const mergeGuestCart = useMergeGuestCart();

  // Auto-refresh access token on mount
  useAuth();

  useEffect(() => {
    handleGoogleLogin();
  }, [handleGoogleLogin]);

  // Helper to get cookie value
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  // Listen for Google login success to merge cart and redirect
  useEffect(() => {
    const handleGoogleLoginSuccess = async () => {
      console.log("[ClientShell] Google login success detected");

      // Try to merge guest cart if exists
      const guestToken = getCookie("guestToken");
      if (guestToken) {
        try {
          console.log("[ClientShell] Merging guest cart...");
          await mergeGuestCart.mutateAsync(guestToken);
          console.log("[ClientShell] Guest cart merged successfully");
        } catch (mergeError) {
          console.error(
            "[ClientShell] Failed to merge guest cart:",
            mergeError,
          );
          // Don't block user flow, just log the error
        }
      }

      // Refetch cart after merge
      console.log("[ClientShell] Refetching cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Redirect to account page to show user info
      setTimeout(() => {
        router.push("/account");
      }, 500);
    };

    window.addEventListener("google-login-success", handleGoogleLoginSuccess);
    return () => {
      window.removeEventListener(
        "google-login-success",
        handleGoogleLoginSuccess,
      );
    };
  }, [queryClient, router, mergeGuestCart]);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <Header setShowLogin={setShowLogin} />
      <Navbar />
      <main className="app">{children}</main>
      <Footer setShowLogin={setShowLogin} />
    </>
  );
};

export default ClientShell;
