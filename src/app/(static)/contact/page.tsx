"use client";

import { useState } from "react";
import "./Contact.scss";

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thông tin đã được gửi! Cảm ơn bạn đã liên hệ.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="contact-container contact-flex">
      <div className="contact-left">
        <div className="contact-title">MI BÁNH BAO</div>
        <div className="contact-info">
          <span>
            <b>Địa chỉ:</b> 68 Tân Sơn, phường 15, quận Tân Bình, thành phố Hồ
            Chí Minh
          </span>
          <span>
            <b>Email:</b> hotro@mibanhbao.vn
          </span>
          <span>
            <b>Hotline:</b> 0942 5533 42
          </span>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div
            className="contact-title"
            style={{ fontSize: "1rem", marginBottom: 16, fontWeight: 500 }}
          >
            Liên hệ với chúng tôi
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />

          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />

          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
          />

          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Nhập nội dung liên hệ"
          />

          <button type="submit">Gửi thông tin</button>
        </form>
      </div>
      <div className="contact-right">
        <iframe
          title="Mi Bánh Bao Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.497964024052!2d106.6390915!3d10.8176941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dfc7d3ba3d1%3A0x37ccc78bce16c78f!2sMi%20B%C3%A1nh%20Bao!5e0!3m2!1svi!2s!4v1691830000000!5m2!1svi!2s"
          width="100%"
          height="410"
          style={{ border: 0, borderRadius: 4 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
