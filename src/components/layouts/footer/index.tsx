"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Footer.module.scss";
import { assets } from "@/src/assets/assets";
import { useRouter } from "next/navigation";
import useIsMobile from "../../../hooks/useIsMobile";

type FooterProps = {
  setShowLogin: (isOpen: boolean) => void;
};

const Footer = ({ setShowLogin }: FooterProps) => {
  const router = useRouter();
  const [showPolicy, setShowPolicy] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className={styles.footer} id="footer">
      <div className={styles.footerContainer}>
        {/* Cột 1 - Thông tin công ty */}
        <div className={styles.footerContent}>
          <h2>HKD MI BÁNH BAO</h2>
          <div className={styles.companyInfo}>
            <p>MST: 8552771447</p>
            <p>68 Tân Sơn, phường 15, quận Tân Bình, HCM</p>
            <p>hotro@mibanhbao.vn</p>
            <p>Hotline: 0942 553 342</p>
          </div>
        </div>

        {/* Cột 2 - Chính sách */}
        <div className={styles.footerContent}>
          <div
            className={styles.footerTitleRow}
            onClick={() => isMobile && setShowPolicy(!showPolicy)}
          >
            <div className={styles.footerTop}>
              <h2>CHÍNH SÁCH</h2>
              {isMobile && (
                <span className={styles.footerToggle}>
                  {showPolicy ? "-" : "+"}
                </span>
              )}
            </div>
          </div>
          <ul
            className={`${styles.footerList} ${isMobile && showPolicy ? styles.active : ""}`}
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
        <div className={styles.footerContent}>
          <div
            className={styles.footerTitleRow}
            onClick={() => isMobile && setShowSupport(!showSupport)}
          >
            <div className={styles.footerTop}>
              <h2>HỖ TRỢ KHÁCH HÀNG</h2>
              {isMobile && (
                <span className={styles.footerToggle}>
                  {showSupport ? "-" : "+"}
                </span>
              )}
            </div>
          </div>
          <ul
            className={`${styles.footerList} ${isMobile && showSupport ? styles.active : ""}`}
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
        <div className={styles.footerContent}>
          <h2>ĐĂNG KÝ NHẬN KHUYẾN MÃI</h2>
          <div className={styles.newsletter}>
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className={styles.newsletterInput}
            />
            <button
              className={styles.newsletterBtn}
              onClick={() => {
                setShowLogin(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Đăng ký
            </button>
          </div>
          <div className={styles.socialSection}>
            <h3>Theo dõi chúng tôi</h3>
            <div className={styles.footerSocialIcon}>
              <Image
                src={assets.twitter_icon}
                alt="Twitter"
                width={24}
                height={24}
              />
              <Image
                src={assets.facebook_icon}
                alt="Facebook"
                width={24}
                height={24}
              />
              <Image
                src={assets.linkedin_icon}
                alt="YouTube"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
      <hr className={styles.footerDivider} />
      {/* Copyright */}
      <div className={styles.footerCopyright}>
        <p>Copyright © Mi Bánh Bao</p>
      </div>
    </div>
  );
};

export default Footer;
