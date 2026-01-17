"use client";

import { ChangeEvent, FormEvent } from "react";
import { ProfileForm, StatusMessage } from "./types";

type ProfileSectionProps = {
  profileForm: ProfileForm;
  handleProfileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleProfileSubmit: (event: FormEvent<HTMLFormElement>) => void;
  profileMessage: StatusMessage | null;
  isProfileSaving: boolean;
  profileLoading: boolean;
};

const ProfileSection = ({
  profileForm,
  handleProfileChange,
  handleProfileSubmit,
  profileMessage,
  isProfileSaving,
  profileLoading,
}: ProfileSectionProps) => (
  <section className="account-card" id="profile-section">
    <div className="account-card-header">
      <div>
        <h2>Thông tin tài khoản</h2>
        <p>Thông tin sẽ được dùng khi bạn đặt hàng hoặc liên hệ.</p>
      </div>
    </div>

    {profileMessage && (
      <p className={`account-status ${profileMessage.type}`}>
        {profileMessage.text}
      </p>
    )}

    <form className="account-form" onSubmit={handleProfileSubmit}>
      <label>
        <span>Họ và tên</span>
        <input
          name="name"
          value={profileForm.name}
          onChange={handleProfileChange}
          placeholder="Ví dụ: Nguyễn Văn A"
          required
        />
      </label>
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={profileForm.email}
          onChange={handleProfileChange}
          placeholder="name@example.com"
          required
        />
      </label>
      <label>
        <span>Số điện thoại</span>
        <input
          name="phone"
          type="tel"
          value={profileForm.phone}
          onChange={handleProfileChange}
          placeholder="0901234567"
        />
      </label>
      <button
        type="submit"
        className="primary"
        disabled={isProfileSaving || profileLoading}
      >
        {isProfileSaving ? "Đang lưu..." : "Lưu thông tin"}
      </button>
    </form>
  </section>
);

export default ProfileSection;
