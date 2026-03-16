"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./LoginPopup.scss";
import { assets } from "@/src/assets/assets";
import useStore from "@/src/store/useStore";
import authApiRequest from "@/src/apiRequests/auth";
import { useMergeGuestCart } from "@/src/queries/useCart";
import { API_URL } from "@/src/constants/api";

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const LoginPopup = ({ setShowLogin }: any) => {
  const queryClient = useQueryClient();
  const setToken = useStore((state: any) => state.setToken);
  const mergeGuestCart = useMergeGuestCart();

  const [currState, setCurrState] = useState("Đăng nhập");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onhandleChange = (e: any) => {
    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const onLogin = async (e: any) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error

    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };

    // Validation
    if (!data.email || !data.password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    if (!isValidEmail(data.email)) {
      setErrorMessage("Email không đúng định dạng");
      return;
    }

    if (currState === "Đăng ký" && !data.name) {
      setErrorMessage("Vui lòng nhập họ tên");
      return;
    }

    try {
      let response;

      if (currState === "Đăng nhập") {
        console.log("[LoginPopup] Calling login Route Handler...");
        response = await authApiRequest.login({
          email: data.email,
          password: data.password,
        });
      } else {
        console.log("[LoginPopup] Calling register Route Handler...");
        response = await authApiRequest.register({
          name: data.name,
          email: data.email,
          password: data.password,
        });
      }

      console.log("[LoginPopup] Response:", response);
      console.log("[LoginPopup] Response success:", response.success);
      console.log("[LoginPopup] Has accessToken:", !!response.accessToken);

      if (response.success) {
        // Set access token in memory only (Zustand store)
        // Do NOT save to localStorage for security (XSS protection)
        if (response.accessToken) {
          console.log("[LoginPopup] Setting token in Zustand store");
          setToken(response.accessToken);
        }

        // Note: Cookies are HttpOnly and cannot be read by JavaScript
        // They are automatically sent with requests by the browser
        console.log("[LoginPopup] Login successful, cookies set by server");

        // Merge guest cart if exists (only on login, not register)
        if (currState === "Đăng nhập") {
          const guestToken = getCookie("guestToken");
          if (guestToken) {
            try {
              await mergeGuestCart.mutateAsync(guestToken);
              console.log("Guest cart merged successfully");
            } catch (mergeError) {
              console.error("Failed to merge guest cart:", mergeError);
              // Don't show error to user, just log it
            }
          }
        }

        // Refetch cart and account data after successful login/register
        console.log(
          "Login/Register successful, refetching cart and account...",
        );
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["cart"] }),
          queryClient.invalidateQueries({ queryKey: ["account"] }),
        ]);

        setShowLogin(false);
      }

      // Refresh token is automatically stored in HttpOnly cookie by server
      else {
        const message = response.message;
        if (currState === "Đăng nhập") {
          if (message === "User not found") {
            setErrorMessage(
              "Email không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.",
            );
          } else if (message === "Invalid credentials") {
            setErrorMessage("Mật khẩu không đúng. Vui lòng thử lại.");
          } else {
            setErrorMessage(message || "Đăng nhập thất bại");
          }
        } else {
          setErrorMessage(message || "Đăng ký thất bại");
        }
      }
    } catch (error: any) {
      console.error("[LoginPopup] Error:", error);
      console.error("Error response:", error.response);

      // Route Handlers return errors via response.data
      if (error.payload) {
        const errorMsg = error.payload.message;

        setErrorMessage(errorMsg || "Đăng nhập thất bại");
      } else {
        setErrorMessage("Không thể kết nối tới server. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="login-popup" onClick={() => setShowLogin(false)}>
      <form
        onSubmit={onLogin}
        onClick={(e) => e.stopPropagation()}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <p
            onClick={() => setShowLogin(false)}
            style={{
              cursor: "pointer",
            }}
          >
            X
          </p>
        </div>
        <div className="login-popup-inputs">
          {currState === "Đăng nhập" ? (
            <> </>
          ) : (
            <input
              name="name"
              onChange={onhandleChange}
              value={data.name}
              type="text"
              placeholder="Họ và tên"
              required
            />
          )}
          <input
            name="email"
            onChange={onhandleChange}
            value={data.email}
            type="email"
            placeholder="Email"
            pattern="^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$"
            title="Vui lòng nhập email hợp lệ"
            required
          />
          <input
            name="password"
            onChange={onhandleChange}
            value={data.password}
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">
          {currState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        {currState === "Đăng nhập" ? (
          <>
            <p>
              Chưa có tài khoản?{" "}
              <span onClick={() => setCurrState("Đăng ký")}>Đăng ký ngay</span>
            </p>
            <button
              type="button"
              className="google-login-btn"
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              //   width: "100%",
              //   marginTop: "16px",
              //   background: "#fff",
              //   color: "#333",
              //   border: "1px solid #ccc",
              //   padding: "8px 16px",
              //   borderRadius: "4px",
              //   cursor: "pointer",
              // }}
              onClick={() => {
                window.location.href = `${API_URL}/auth/google`;
              }}
            >
              <img
                src={assets.google_icon}
                alt="Google"
                style={{ width: 20, marginRight: 8 }}
              />{" "}
              <p>Đăng nhập với Google</p>
            </button>
          </>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Đăng nhập")}>
              Đăng nhập tại đây
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
