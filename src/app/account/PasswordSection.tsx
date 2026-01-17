"use client";

import { ChangeEvent, FormEvent } from "react";
import { PasswordForm, StatusMessage } from "./types";

type PasswordSectionProps = {
  passwordForm: PasswordForm;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordSubmit: (event: FormEvent<HTMLFormElement>) => void;
  passwordMessage: StatusMessage | null;
  isPasswordSaving: boolean;
};

const PasswordSection = ({
  passwordForm,
  handlePasswordChange,
  handlePasswordSubmit,
  passwordMessage,
  isPasswordSaving,
}: PasswordSectionProps) => (
  <section className="account-card" id="password-section">
    <div className="account-card-header">
      <div>
        <h2>Đổi mật khẩu</h2>
        <p>Chỉ áp dụng cho tài khoản đã từng tạo mật khẩu Mi Bánh Bao.</p>
      </div>
    </div>

    {passwordMessage && (
      <p className={`account-status ${passwordMessage.type}`}>
        {passwordMessage.text}
      </p>
    )}

    <form className="account-form" onSubmit={handlePasswordSubmit}>
      <label>
        <span>Mật khẩu hiện tại</span>
        <input
          name="currentPassword"
          type="password"
          value={passwordForm.currentPassword}
          onChange={handlePasswordChange}
          placeholder="********"
          required
        />
      </label>
      <label>
        <span>Mật khẩu mới</span>
        <input
          name="newPassword"
          type="password"
          value={passwordForm.newPassword}
          onChange={handlePasswordChange}
          placeholder="Tối thiểu 6 ký tự"
          required
        />
      </label>
      <button
        type="submit"
        className="primary ghost"
        disabled={isPasswordSaving}
      >
        {isPasswordSaving ? "Đang đổi..." : "Cập nhật mật khẩu"}
      </button>
    </form>
  </section>
);

export default PasswordSection;
