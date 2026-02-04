"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import useStore from "@/src/store/useStore";
import { PasswordForm, StatusMessage, passwordFormSchema } from "../types";
import { accountAPI } from "@/src/app/api/account/route";
import styles from "./PasswordSection.module.scss";

const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
};

const getStatusVariantClass = (type?: string) => {
  if (type === "success") return styles.accountStatusSuccess;
  if (type === "error") return styles.accountStatusError;
  return "";
};

const PasswordSection = () => {
  const token = useStore((state: any) => state.token);
  const url = useStore((state: any) => state.url);
  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);
  const [passwordMessage, setPasswordMessage] = useState<StatusMessage | null>(
    null,
  );
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = passwordFormSchema.safeParse(passwordForm);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Vui lòng kiểm tra mật khẩu";
      setPasswordMessage({ type: "error", text: message });
      return;
    }
    setIsPasswordSaving(true);
    try {
      await accountAPI.changePassword(
        parsed.data.currentPassword,
        parsed.data.newPassword,
      );
      setPasswordMessage({
        type: "success",
        text: "Mật khẩu đã được cập nhật",
      });
      setPasswordForm(initialPasswordForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể đổi mật khẩu";
      setPasswordMessage({ type: "error", text: message });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  if (!token) return null;

  return (
    <section className={styles.accountCard} id="password-section">
      <div className={styles.accountCardHeader}>
        <div>
          <h2>Đổi mật khẩu</h2>
          <p>Chỉ áp dụng cho tài khoản đã từng tạo mật khẩu Mi Bánh Bao.</p>
        </div>
      </div>

      {passwordMessage && (
        <p
          className={`${styles.accountStatus} ${getStatusVariantClass(
            passwordMessage.type,
          )}`}
        >
          {passwordMessage.text}
        </p>
      )}

      <form className={styles.accountForm} onSubmit={handlePasswordSubmit}>
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
          className={`${styles.primaryButton} ${styles.primaryGhost}`}
          disabled={isPasswordSaving}
        >
          {isPasswordSaving ? "Đang đổi..." : "Cập nhật mật khẩu"}
        </button>
      </form>
    </section>
  );
};

export default PasswordSection;
