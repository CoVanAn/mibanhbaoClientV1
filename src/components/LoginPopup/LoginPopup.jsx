"use client";

import React, { useEffect, useState } from "react";
import "./LoginPopup.scss";
import { assets } from "@/src/assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

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

  const onhandleChange = (e) => {
    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error

    // Validation
    if (!data.email || !data.password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    if (currState === "Đăng ký" && !data.name) {
      setErrorMessage("Vui lòng nhập họ tên");
      return;
    }

    let newUrl = url;
    if (currState === "Đăng nhập") {
      newUrl = `${url}/api/user/login`;
    } else {
      newUrl = `${url}/api/user/register`;
    }

    console.log("Sending request to:", newUrl);
    console.log("Data being sent:", data);

    try {
      const response = await axios.post(newUrl, data);
      console.log("Response:", response.data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        const message = response.data.message;
        if (currState === "Đăng nhập") {
          if (message === "User not found") {
            setErrorMessage(
              "Email không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới."
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
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      if (error.response) {
        console.error("Error response:", error.response.data);
        const errorMsg = error.response.data.message;

        if (currState === "Đăng nhập") {
          if (errorMsg === "User not found") {
            setErrorMessage(
              "Email không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới."
            );
          } else if (errorMsg === "Invalid credentials") {
            setErrorMessage("Mật khẩu không đúng. Vui lòng thử lại.");
          } else if (errorMsg === "Email and password are required") {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
          } else {
            setErrorMessage(errorMsg || "Đăng nhập thất bại");
          }
        } else {
          if (errorMsg === "User already exists") {
            setErrorMessage("Email đã được sử dụng. Vui lòng chọn email khác.");
          } else {
            setErrorMessage(errorMsg || "Đăng ký thất bại");
          }
        }
      } else {
        setErrorMessage("Không thể kết nối tới server. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div action="" className="login-popup-inputs">
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
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>Tôi đồng ý với điều khoản sử dụng</p>
        </div>
        {currState === "Đăng nhập" ? (
          <>
            <p>
              Chưa có tài khoản?{" "}
              <span onClick={() => setCurrState("Đăng ký")}>Đăng ký ngay</span>
            </p>
            <button
              type="button"
              className="google-login-btn"
              style={{
                marginTop: "16px",
                background: "#fff",
                color: "#333",
                border: "1px solid #ccc",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => {
                window.location.href = `${url}/auth/google`;
              }}
            >
              <img
                src={assets.google_icon}
                alt="Google"
                style={{ width: 20, marginRight: 8 }}
              />{" "}
              Đăng nhập với Google
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
