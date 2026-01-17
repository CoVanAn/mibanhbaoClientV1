"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useStore from "@/src/store/useStore";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import AddressSection from "./AddressSection";
import {
  Address,
  AddressForm,
  PasswordForm,
  ProfileForm,
  StatusMessage,
  User,
} from "./types";
import "./Account.scss";

const initialProfileForm: ProfileForm = { name: "", email: "", phone: "" };
const initialAddressForm: AddressForm = {
  name: "",
  phone: "",
  company: "",
  addressLine: "",
  province: "",
  district: "",
  ward: "",
};
const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
};

export default function Page() {
  const token = useStore((state) => state.token);
  const url = useStore((state) => state.url);
  const [user, setUser] = useState<User | null>(null);
  const [profileForm, setProfileForm] =
    useState<ProfileForm>(initialProfileForm);
  const [profileMessage, setProfileMessage] = useState<StatusMessage | null>(
    null
  );
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressForm, setAddressForm] =
    useState<AddressForm>(initialAddressForm);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressMessage, setAddressMessage] = useState<StatusMessage | null>(
    null
  );
  const [isAddressSaving, setIsAddressSaving] = useState(false);

  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);
  const [passwordMessage, setPasswordMessage] = useState<StatusMessage | null>(
    null
  );
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const fetchUserProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const res = await fetch(`${url}/api/user/profile`, {
        headers: { token },
      });
      const data = (await res.json()) as { user?: User; message?: string };
      if (!res.ok) {
        setProfileMessage({
          type: "error",
          text: data.message || "Không thể tải hồ sơ",
        });
        return;
      }
      if (data.user) {
        setUser(data.user);
        setProfileForm({
          name: data.user.name ?? "",
          email: data.user.email ?? "",
          phone: data.user.phone ?? "",
        });
      }
      setProfileMessage(null);
    } catch (error) {
      setProfileMessage({ type: "error", text: "Có lỗi khi tải hồ sơ" });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!token) return;
    setAddressesLoading(true);
    try {
      const res = await fetch(`${url}/api/user/addresses`, {
        headers: { token },
      });
      const data = (await res.json()) as {
        addresses?: Address[];
        message?: string;
      };
      if (res.ok) {
        setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
        setAddressMessage(null);
      } else {
        setAddressMessage({
          type: "error",
          text: data.message || "Không thể tải địa chỉ",
        });
      }
    } catch (error) {
      setAddressMessage({ type: "error", text: "Lỗi khi tải địa chỉ" });
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUserProfile();
    fetchAddresses();
  }, [token, url]);

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileMessage({ type: "error", text: "Tên và email là bắt buộc" });
      return;
    }
    setIsProfileSaving(true);
    try {
      const res = await fetch(`${url}/api/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          phone: profileForm.phone.trim() || null,
        }),
      });
      const data = (await res.json()) as { user?: User; message?: string };
      if (!res.ok) {
        throw new Error(data.message || "Không thể cập nhật hồ sơ");
      }
      if (data.user) {
        setUser(data.user);
      }
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

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetAddressForm = () => {
    setAddressForm(initialAddressForm);
    setEditingAddressId(null);
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const required: Array<keyof AddressForm> = [
      "name",
      "phone",
      "addressLine",
      "province",
      "district",
      "ward",
    ];
    for (const field of required) {
      if (!addressForm[field].trim()) {
        setAddressMessage({
          type: "error",
          text: "Vui lòng điền đầy đủ thông tin địa chỉ",
        });
        return;
      }
    }
    setIsAddressSaving(true);
    try {
      const endpoint = editingAddressId
        ? `${url}/api/user/addresses/${editingAddressId}`
        : `${url}/api/user/addresses`;
      const method = editingAddressId ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          name: addressForm.name.trim(),
          phone: addressForm.phone.trim(),
          company: addressForm.company.trim() || null,
          addressLine: addressForm.addressLine.trim(),
          province: addressForm.province.trim(),
          district: addressForm.district.trim(),
          ward: addressForm.ward.trim(),
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        throw new Error(data.message || "Không thể lưu địa chỉ");
      }
      setAddressMessage({
        type: "success",
        text: editingAddressId
          ? "Địa chỉ đã được cập nhật"
          : "Địa chỉ đã được thêm",
      });
      resetAddressForm();
      await fetchAddresses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu địa chỉ";
      setAddressMessage({ type: "error", text: message });
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      name: address.name ?? "",
      phone: address.phone ?? "",
      company: address.company ?? "",
      addressLine: address.addressLine ?? "",
      province: address.province ?? "",
      district: address.district ?? "",
      ward: address.ward ?? "",
    });
    setEditingAddressId(address.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      const res = await fetch(`${url}/api/user/addresses/${id}`, {
        method: "DELETE",
        headers: { token },
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        throw new Error(data.message || "Không thể xóa địa chỉ");
      }
      setAddressMessage({ type: "success", text: "Địa chỉ đã được xóa" });
      await fetchAddresses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa địa chỉ";
      setAddressMessage({ type: "error", text: message });
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordMessage({
        type: "error",
        text: "Cần nhập mật khẩu hiện tại và mới",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu mới tối thiểu 6 ký tự",
      });
      return;
    }
    setIsPasswordSaving(true);
    try {
      const res = await fetch(`${url}/api/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        throw new Error(data.message || "Không thể đổi mật khẩu");
      }
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

  if (!token) {
    return (
      <div className="account">
        <div className="account-wrapper">
          <div className="account-empty">
            <h2>Đăng nhập để quản lý tài khoản</h2>
            <p>Hãy đăng nhập để xem thông tin hồ sơ, địa chỉ và đơn hàng.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account">
      <div className="account-wrapper">
        <header className="account-hero">
          <div>
            <p className="account-overline">Tài khoản của tôi</p>
            <h1>Xin chào{user?.name ? `, ${user.name}` : ""}!</h1>
            <p className="account-subtitle">
              Quản lý thông tin cơ bản, địa chỉ giao hàng và mật khẩu để việc
              mua sắm luôn trơn tru.
            </p>
          </div>
        </header>

        <div className="account-grid">
          <ProfileSection
            profileForm={profileForm}
            handleProfileChange={handleProfileChange}
            handleProfileSubmit={handleProfileSubmit}
            profileMessage={profileMessage}
            isProfileSaving={isProfileSaving}
            profileLoading={profileLoading}
          />
          <PasswordSection
            passwordForm={passwordForm}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
            passwordMessage={passwordMessage}
            isPasswordSaving={isPasswordSaving}
          />
        </div>

        <AddressSection
          addressForm={addressForm}
          handleAddressChange={handleAddressChange}
          handleAddressSubmit={handleAddressSubmit}
          addressMessage={addressMessage}
          isAddressSaving={isAddressSaving}
          resetAddressForm={resetAddressForm}
          editingAddressId={editingAddressId}
          addresses={addresses}
          addressesLoading={addressesLoading}
          handleEditAddress={handleEditAddress}
          handleDeleteAddress={handleDeleteAddress}
        />
      </div>
    </div>
  );
}
