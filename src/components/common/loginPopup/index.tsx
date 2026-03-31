"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import "./LoginPopup.scss";
import { assets } from "@/src/assets/assets";
import useStore, { UserSlice } from "@/src/store/user";
import authApiRequest from "@/src/apiRequests/auth";
import { useMergeGuestCart } from "@/src/queries/useCart";
import { API_URL } from "@/src/store/constants";
import { getCookie } from "@/src/lib/cookies";
import logger from "@/src/lib/logger";

type LoginPopupProps = {
  setShowLogin: (isOpen: boolean) => void;
};

type LoginState = "Đăng nhập" | "Đăng ký";

type LoginFormData = {
  name: string;
  email: string;
  password: string;
};

const LoginPopup = ({ setShowLogin }: LoginPopupProps) => {
  const queryClient = useQueryClient();
  const setToken = useStore((state: UserSlice) => state.setToken);
  const mergeGuestCart = useMergeGuestCart();

  const [currState, setCurrState] = useState<LoginState>("Đăng nhập");
  const [data, setData] = useState<LoginFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

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

    setIsSubmitting(true);

    try {
      let response;

      if (currState === "Đăng nhập") {
        response = await authApiRequest.login({
          email: data.email,
          password: data.password,
        });
      } else {
        response = await authApiRequest.register({
          name: data.name,
          email: data.email,
          password: data.password,
        });
      }

      if (response.success) {
        // Set access token in memory only (Zustand store)
        // Do NOT save to localStorage for security (XSS protection)
        if (response.accessToken) {
          setToken(response.accessToken);
        }

        // Note: Cookies are HttpOnly and cannot be read by JavaScript
        // They are automatically sent with requests by the browser

        // Merge guest cart if exists (only on login, not register)
        if (currState === "Đăng nhập") {
          const guestToken = getCookie("guestToken");
          if (guestToken) {
            try {
              await mergeGuestCart.mutateAsync(guestToken);
            } catch (mergeError) {
              logger.warn("[loginPopup] Guest cart merge failed", mergeError);
            }
          }
        }

        // Refetch cart and account data after successful login/register
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
    } catch (error: unknown) {
      logger.error("[loginPopup] Authentication request failed", error);

      const errorPayload =
        typeof error === "object" &&
        error !== null &&
        "payload" in error &&
        typeof (error as { payload?: { message?: string } }).payload
          ?.message === "string"
          ? (error as { payload?: { message?: string } }).payload
          : undefined;

      // Route Handlers return errors via response.data
      if (errorPayload) {
        const errorMsg = errorPayload.message;

        setErrorMessage(errorMsg || "Đăng nhập thất bại");
      } else {
        setErrorMessage("Không thể kết nối tới server. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
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
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="login-popup-close"
            aria-label="Đóng cửa sổ đăng nhập"
            disabled={isSubmitting}
          >
            X
          </button>
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
              disabled={isSubmitting}
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
            disabled={isSubmitting}
            required
          />
          <input
            name="password"
            onChange={onhandleChange}
            value={data.password}
            type="password"
            placeholder="Mật khẩu"
            disabled={isSubmitting}
            required
          />
        </div>
        {errorMessage && (
          <p className="error-message" aria-live="polite">
            {errorMessage}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Đang xử lý..."
            : currState === "Đăng ký"
              ? "Tạo tài khoản"
              : "Đăng nhập"}
        </button>
        {currState === "Đăng nhập" ? (
          <>
            <p>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                className="text-action-btn"
                onClick={() => {
                  setErrorMessage("");
                  setCurrState("Đăng ký");
                }}
                disabled={isSubmitting}
              >
                Đăng ký ngay
              </button>
            </p>
            <button
              type="button"
              className="google-login-btn"
              disabled={isSubmitting}
              onClick={() => {
                window.location.href = `${API_URL}/auth/google`;
              }}
            >
              <Image
                src={assets.google_icon}
                alt="Google"
                width={20}
                height={20}
                className="google-login-icon"
              />
              <span>Đăng nhập với Google</span>
            </button>
          </>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <button
              type="button"
              className="text-action-btn"
              onClick={() => {
                setErrorMessage("");
                setCurrState("Đăng nhập");
              }}
              disabled={isSubmitting}
            >
              Đăng nhập tại đây
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
