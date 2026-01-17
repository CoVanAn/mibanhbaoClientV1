"use client";

import { useEffect, useState } from "react";
import "./Header.scss";
import useStore from "@/src/store/useStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = ({ setShowLogin }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const token = useStore((state) => state.token);
  const setToken = useStore((state) => state.setToken);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".navbar-profile")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-left">
          <span>Hotline: 0942 5533 42</span>
          <span>Email: hotro@mibanhbao.vn</span>
        </div>
        <div className="header-right">
          {!token ? (
            <>
              <span
                onClick={() => setShowLogin(true)}
                className="header-login-btn"
              >
                Đăng nhập
              </span>
              <span
                className="header-login-btn"
                onClick={() => setShowLogin(true)}
              >
                Đăng ký
              </span>
              {/* <span>Liên hệ</span> */}
            </>
          ) : (
            <>
              <Link className="header-login-btn" href="/account">
                Tài khoản
              </Link>
              {/* {showProfileDropdown && (
                    <ul className='header-profile-dropdown'>
                      <li onClick={() => {navigate('/myorders'); setShowProfileDropdown(false)}}>
                        <img src={assets.bag_icon} alt="" />
                        <p>Đơn hàng của tôi</p>
                      </li>
                      <hr />
                      <li onClick={() => {logout(); setShowProfileDropdown(false)}}>
                        <img src={assets.logout_icon} alt="" />
                        <p>Đăng xuất</p>
                      </li>
                    </ul>
                  )} */}
              {/* </div> */}
              <span className="login-btn" onClick={logout}>
                Đăng xuất
              </span>
              {/* <span className='login-btn'>Liên hệ</span> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
