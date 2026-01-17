export type StatusMessage = { type: "error" | "success" | "info"; text: string };

export type ProfileForm = { name: string; email: string; phone: string };

export type AddressForm = {
  name: string;
  phone: string;
  company: string;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
};

export type PasswordForm = { currentPassword: string; newPassword: string };

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export type Address = {
  id: string;
  name: string;
  phone: string;
  company?: string | null;
  addressLine: string;
  province: string;
  district: string;
  ward: string;
};
