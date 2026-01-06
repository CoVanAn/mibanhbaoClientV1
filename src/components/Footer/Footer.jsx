"use client";

import React, { useState, useEffect } from "react";
import "./Footer.scss";
import { assets } from "@/src/assets/assets";
import { useRouter } from "next/navigation";
import useIsMobile from "../../hooks/useIsMobile";

const Footer = () => {
  const router = useRouter();
  const [showPolicy, setShowPolicy] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="footer" id="footer">
      <div className="footer-container">
        {/* Cột 1 - Thông tin công ty */}
        <div className="footer-content">
          <h2>HKD MI BÁNH BAO</h2>
          <div className="company-info">
            <p>MST: 8552771447</p>
            <p>68 Tân Sơn, phường 15, quận Tân Bình, HCM</p>
            <p>hotro@mibanhbao.vn</p>
            <p>Hotline: 0942 553 342</p>
          </div>
        </div>

        {/* Cột 2 - Chính sách */}
        <div className="footer-content">
          <div
            className="footer-title-row"
            onClick={() => isMobile && setShowPolicy(!showPolicy)}
          >
            <div className="footer-top">
              <h2>CHÍNH SÁCH</h2>
              {isMobile && (
                <span className="footer-toggle">{showPolicy ? "-" : "+"}</span>
              )}
            </div>
          </div>
          <ul
            className={
              isMobile
                ? showPolicy
                  ? "footer-list active"
                  : "footer-list"
                : ""
            }
            aria-expanded={showPolicy}
          >
            <li
              onClick={() => {
                router.push("/chinh-sach-van-chuyen");
              }}
            >
              Chính sách vận chuyển
            </li>
            <li
              onClick={() => {
                router.push("/chinh-sach-doi-tra");
              }}
            >
              Chính sách đổi trả hàng
            </li>
            <li
              onClick={() => {
                router.push("/chinh-sach-bao-mat");
              }}
            >
              Chính sách bảo mật
            </li>
          </ul>
        </div>

        {/* Cột 3 - Hỗ trợ khách hàng */}
        <div className="footer-content">
          <div
            className="footer-title-row"
            onClick={() => isMobile && setShowSupport(!showSupport)}
          >
            <div className="footer-top">
              <h2>HỖ TRỢ KHÁCH HÀNG</h2>
              {isMobile && (
                <span className="footer-toggle">{showSupport ? "-" : "+"}</span>
              )}
            </div>
          </div>
          <ul
            className={
              isMobile
                ? showSupport
                  ? "footer-list active"
                  : "footer-list"
                : ""
            }
            aria-expanded={showSupport}
          >
            <li
              onClick={() => {
                router.push("/huong-dan-mua-hang");
              }}
            >
              Hướng dẫn mua hàng
            </li>
            <li
              onClick={() => {
                router.push("/huong-dan-thanh-toan");
              }}
            >
              Hướng dẫn thanh toán
            </li>
            <li
              onClick={() => {
                router.push("/huong-dan-giao-nhan");
              }}
            >
              Hướng dẫn giao nhận
            </li>
            <li
              onClick={() => {
                router.push("/dieu-khoan-dich-vu");
              }}
            >
              Điều khoản dịch vụ
            </li>
          </ul>
        </div>

        {/* Cột 4 - Đăng ký nhận khuyến mãi */}
        <div className="footer-content">
          <h2>ĐĂNG KÝ NHẬN KHUYẾN MÃI</h2>
          <div className="newsletter">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="newsletter-input"
            />
            <button className="newsletter-btn">Đăng ký</button>
          </div>
          <div className="social-section">
            <h3>Theo dõi chúng tôi</h3>
            <div className="footer-social-icon">
              <img src={assets.twitter_icon} alt="Twitter" />
              <img src={assets.facebook_icon} alt="Facebook" />
              <img src={assets.linkedin_icon} alt="YouTube" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* Copyright */}
      <div className="footer-copyright">
        <p>Copyright © Mi Bánh Bao</p>
      </div>
    </div>
  );
};

export default Footer;
