import {
  Address,
  AddressForm,
  ProfileForm,
  User,
} from "@/src/app/account/types";
import apiClient from "@/src/lib/api";

export async function fetchUserProfile(): Promise<User> {
  const response = await apiClient.get("/api/user/profile");
  const payload = response.data as { user?: User; message?: string };
  if (!payload.user) {
    throw new Error(payload.message || "Không thể tải hồ sơ");
  }
  return payload.user;
}

export async function updateUserProfile(form: ProfileForm): Promise<User> {
  const response = await apiClient.patch("/api/user/profile", {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
  });
  const payload = response.data as { user?: User; message?: string };
  if (!payload.user) {
    throw new Error(payload.message || "Không thể cập nhật hồ sơ");
  }
  return payload.user;
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await apiClient.get("/api/user/addresses");
  const payload = response.data as {
    addresses?: Address[];
    message?: string;
  };
  return payload.addresses ?? [];
}

export async function saveAddress(
  form: AddressForm,
  addressId?: string,
): Promise<void> {
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
}

export async function deleteAddress(id: string) {
  const response = await apiClient.delete(`/api/user/addresses/${id}`);
  const payload = response.data as { message?: string };
  if (!response.data.success) {
    throw new Error(payload.message || "Không thể xóa địa chỉ");
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await apiClient.post("/api/user/change-password", {
    currentPassword,
    newPassword,
  });
  const payload = response.data as { message?: string };
  if (!response.data.success) {
    throw new Error(payload.message || "Không thể đổi mật khẩu");
  }
}
