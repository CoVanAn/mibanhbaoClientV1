"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useStore from "@/src/store/useStore";
import { useAccountContext } from "../content";
import { ProfileForm, StatusMessage, profileFormSchema } from "../types";
import { accountAPI } from "@/src/apiRequests/account";
import styles from "./Profile.module.scss";

const initialProfileForm: ProfileForm = {
  name: "",
  email: "",
  phone: "",
};

const ProfileSection = () => {
  const token = useStore((state: any) => state.token);
  const url = useStore((state: any) => state.url);
  const { user, setUser } = useAccountContext();
  const [profileForm, setProfileForm] =
    useState<ProfileForm>(initialProfileForm);
  const [profileMessage, setProfileMessage] = useState<StatusMessage | null>(
    null,
  );
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const userData = await accountAPI.getProfile();
        if (!isMounted) return;
        setUser(userData);
        setProfileForm({
          name: userData.name ?? "",
          email: userData.email ?? "",
          phone: userData.phone ?? "",
        });
        setProfileMessage(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Có lỗi khi tải hồ sơ";
        setProfileMessage({ type: "error", text: message });
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [token, url, setUser]);

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = profileFormSchema.safeParse(profileForm);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Vui lòng kiểm tra thông tin";
      setProfileMessage({ type: "error", text: message });
      return;
    }
    setIsProfileSaving(true);
    try {
      const updated = await accountAPI.updateProfile(parsed.data);
      setUser(updated);
      setProfileMessage({
        type: "success",
        text: "Đã lưu thông tin tài khoản",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể cập nhật hồ sơ";
      setProfileMessage({ type: "error", text: message });
    } finally {
      setIsProfileSaving(false);
    }
  };

  if (!token) return null;

  return (
    <section className={styles.accountCard} id="profile-section">
      <div className={styles.accountCardHeader}>
        <div>
          <h2>Thông tin tài khoản</h2>
          <p>Thông tin sẽ được dùng khi bạn đặt hàng hoặc liên hệ.</p>
        </div>
      </div>

      {profileMessage && (
        <p
          className={`${styles.accountStatus} ${
            profileMessage.type === "success"
              ? styles.accountStatusSuccess
              : profileMessage.type === "error"
                ? styles.accountStatusError
                : ""
          }`}
        >
          {profileMessage.text}
        </p>
      )}

      <form className={styles.accountForm} onSubmit={handleProfileSubmit}>
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
          className={`${styles.primaryButton} ${
            isProfileSaving || profileLoading
              ? styles.primaryButtonDisabled
              : ""
          }`}
          disabled={isProfileSaving || profileLoading}
        >
          {isProfileSaving ? "Đang lưu..." : "Lưu thông tin"}
        </button>
      </form>
    </section>
  );
};

export default ProfileSection;
