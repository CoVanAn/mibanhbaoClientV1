import {
  Address,
  AddressForm,
  ProfileForm,
  User,
} from "@/src/app/account/types";

const buildHeaders = (token: string) => ({
  "Content-Type": "application/json",
  token,
});

export async function fetchUserProfile(token: string, url: string): Promise<User> {
  const response = await fetch(`${url}/api/user/profile`, {
    headers: { token },
  });
  const payload = (await response.json()) as { user?: User; message?: string };
  if (!response.ok || !payload.user) {
    throw new Error(payload.message || "Không thể tải hồ sơ");
  }
  return payload.user;
}

export async function updateUserProfile(
  token: string,
  url: string,
  form: ProfileForm,
): Promise<User> {
  const response = await fetch(`${url}/api/user/profile`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
    }),
  });
  const payload = (await response.json()) as { user?: User; message?: string };
  if (!response.ok || !payload.user) {
    throw new Error(payload.message || "Không thể cập nhật hồ sơ");
  }
  return payload.user;
}

export async function fetchAddresses(
  token: string,
  url: string,
): Promise<Address[]> {
  const response = await fetch(`${url}/api/user/addresses`, {
    headers: { token },
  });
  const payload = (await response.json()) as {
    addresses?: Address[];
    message?: string;
  };
  if (!response.ok) {
    throw new Error(payload.message || "Không thể tải địa chỉ");
  }
  return payload.addresses ?? [];
}

export async function saveAddress(
  token: string,
  url: string,
  form: AddressForm,
  addressId?: string,
): Promise<void> {
  const endpoint = addressId
    ? `${url}/api/user/addresses/${addressId}`
    : `${url}/api/user/addresses`;
  const method = addressId ? "PATCH" : "POST";
  const response = await fetch(endpoint, {
    method,
    headers: buildHeaders(token),
    body: JSON.stringify({
      name: form.name.trim(),
      phone: form.phone.trim(),
      company: form.company.trim() || null,
      addressLine: form.addressLine.trim(),
      province: form.province.trim(),
      district: form.district.trim(),
      ward: form.ward.trim(),
    }),
  });
  const payload = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(payload.message || "Không thể lưu địa chỉ");
  }
}

export async function deleteAddress(token: string, url: string, id: string) {
  const response = await fetch(`${url}/api/user/addresses/${id}`, {
    method: "DELETE",
    headers: { token },
  });
  const payload = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(payload.message || "Không thể xóa địa chỉ");
  }
}

export async function changePassword(
  token: string,
  url: string,
  currentPassword: string,
  newPassword: string,
) {
  const response = await fetch(`${url}/api/user/change-password`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
  const payload = (await response.json()) as { message?: string };
  if (!response.ok) {
    throw new Error(payload.message || "Không thể đổi mật khẩu");
  }
}
