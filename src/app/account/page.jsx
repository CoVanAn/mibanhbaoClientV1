"use client";

import { useState, useEffect } from "react";
import "./Account.scss";
import useStore from "@/src/store/useStore";

export default function Page() {
  const token = useStore((state) => state.token);
  const url = useStore((state) => state.url);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${url}/api/user/profile`, {
          headers: { token },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, [token, url]);

  if (!token)
    return (
      <div className="account">
        <div className="account-container"></div>
        Vui lòng đăng nhập để xem thông tin tài khoản.
      </div>
    );

  if (!user)
    return (
      <div className="account">
        <div className="account-container"></div>
        Đang tải thông tin tài khoản...
      </div>
    );

  return (
    <div className="account">
      <div className="account-container">
        <div className="account-left">
          <ul>
            <li>Thông tin tài khoản</li>
            <li>Đơn hàng</li>
            <li>Địa chỉ giao hàng</li>
            <li>Đổi mật khẩu</li>
          </ul>
        </div>

        <div className="account-right">
          <h2>Thông tin tài khoản</h2>
          <p>
            <strong>Tên:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Mật khẩu:</strong>{" "}
            {user.password ? "Đã đặt" : "Đăng nhập Google (không có mật khẩu)"}
          </p>
        </div>
      </div>
    </div>
  );
}
