"use client";

import { FormEvent, useState } from "react";
import { useAccountContext } from "../content";
import { useUpdateProfile } from "@/src/queries/useAccount";
import { StatusMessage, profileFormSchema } from "../types";
import styles from "./Profile.module.scss";

const ProfileSection = () => {
  const { user, isLoading } = useAccountContext();
  const updateProfileMutation = useUpdateProfile();
  const [profileMessage, setProfileMessage] = useState<StatusMessage | null>(
    null,
  );

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const parsed = profileFormSchema.safeParse({
      name: String(formData.get("name") ?? ""),
      email: user?.email ?? "",
      phone: String(formData.get("phone") ?? ""),
    });

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Vui lòng kiểm tra thông tin";
      setProfileMessage({ type: "error", text: message });
      return;
    }

    try {
      // Remove email from data sent to API (email cannot be changed)
      const dataToUpdate = {
        name: parsed.data.name,
        phone: parsed.data.phone,
      };
      await updateProfileMutation.mutateAsync(dataToUpdate);
      setProfileMessage({
        type: "success",
        text: "Đã lưu thông tin tài khoản",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể cập nhật hồ sơ";
      setProfileMessage({ type: "error", text: message });
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <section className={styles.accountCard} id="profile-section">
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
            defaultValue={user?.name ?? ""}
            placeholder="Ví dụ: Nguyễn Văn A"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={user?.email ?? ""}
            placeholder="name@example.com"
            disabled
            title="Email không thể thay đổi"
          />
          {/* <small style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Email không thể thay đổi
          </small> */}
        </label>
        <label>
          <span>Số điện thoại</span>
          <input name="phone" type="tel" defaultValue={user?.phone ?? ""} />
        </label>
        <button
          type="submit"
          className={`${styles.primaryButton} ${
            updateProfileMutation.isPending ? styles.primaryButtonDisabled : ""
          }`}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu thông tin"}
        </button>
      </form>
    </section>
  );
};

export default ProfileSection;
