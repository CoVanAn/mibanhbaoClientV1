/**
 * Account API Requests
 * Account related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";
import type {
  Address,
  AddressForm,
  ProfileForm,
  User,
} from "@/src/app/account/types";

// Type for updating profile (email cannot be changed)
export type UpdateProfileData = Omit<ProfileForm, "email">;

export const accountAPI = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/api/user/profile");
    const payload = response.data as { user?: User; message?: string };
    if (!payload.user) {
      throw new Error(payload.message || "Không thể tải hồ sơ");
    }
    return payload.user;
  },

  updateProfile: async (form: UpdateProfileData): Promise<User> => {
    const response = await apiClient.patch("/api/user/profile", {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
    });
    const payload = response.data as { user?: User; message?: string };
    if (!payload.user) {
      throw new Error(payload.message || "Không thể cập nhật hồ sơ");
    }
    return payload.user;
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get("/api/user/addresses");
    const payload = response.data as {
      addresses?: Address[];
      message?: string;
    };
    return payload.addresses ?? [];
  },

  saveAddress: async (form: AddressForm, addressId?: number): Promise<void> => {
    const endpoint = addressId
      ? `/api/user/addresses/${addressId}`
      : `/api/user/addresses`;
    const method = addressId ? "patch" : "post";

    const response = await apiClient[method](endpoint, {
      name: form.name.trim(),
      phone: form.phone.trim(),
      company: form.company.trim() || null,
      addressLine: form.addressLine.trim(),
      province: form.province.trim(),
      district: form.district.trim(),
      ward: form.ward.trim(),
    });

    const payload = response.data as { message?: string };
    if (!response.data.success) {
      throw new Error(payload.message || "Không thể lưu địa chỉ");
    }
  },

  deleteAddress: async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/api/user/addresses/${id}`);
    const payload = response.data as { message?: string };
    if (!response.data.success) {
      throw new Error(payload.message || "Không thể xóa địa chỉ");
    }
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const response = await apiClient.post("/api/user/change-password", {
      currentPassword,
      newPassword,
    });
    const payload = response.data as { message?: string };
    if (!response.data.success) {
      throw new Error(payload.message || "Không thể đổi mật khẩu");
    }
  },
};

// Re-export types for convenience
export type {
  Address,
  AddressForm,
  ProfileForm,
  User,
} from "@/src/app/account/types";
