/**
 * Account API Requests
 * Account related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";
import {
  addressSchema,
  type Address,
  type AddressForm,
  type ProfileForm,
  type User,
  userSchema,
} from "@/src/schema/account.schema";

// Type for updating profile (email cannot be changed)
export type UpdateProfileData = Omit<ProfileForm, "email">;

const parseUser = (payload: unknown): User => {
  const parsed = userSchema.safeParse(payload);

  if (!parsed.success) {
    console.error("Unexpected profile user shape", parsed.error);
    throw new Error("Không thể tải hồ sơ");
  }

  return parsed.data;
};

const parseAddressList = (payload: unknown): Address[] => {
  const parsed = addressSchema.array().safeParse(payload);

  if (!parsed.success) {
    console.error("Unexpected address list shape", parsed.error);
    throw new Error("Không thể tải địa chỉ");
  }

  return parsed.data;
};

export const accountAPI = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/api/user/profile");
    const payload = response.data as { user?: unknown; message?: string };

    if (!payload.user) {
      throw new Error(payload.message ?? "Không thể tải hồ sơ");
    }

    return parseUser(payload.user);
  },

  updateProfile: async (form: UpdateProfileData): Promise<User> => {
    const response = await apiClient.patch("/api/user/profile", {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
    });
    const payload = response.data as { user?: unknown; message?: string };

    if (!payload.user) {
      throw new Error(payload.message ?? "Không thể cập nhật hồ sơ");
    }

    return parseUser(payload.user);
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get("/api/user/addresses");
    const payload = response.data as {
      addresses?: unknown;
      message?: string;
    };

    if (!payload.addresses) {
      return [];
    }

    return parseAddressList(payload.addresses);
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
} from "@/src/schema/account.schema";
