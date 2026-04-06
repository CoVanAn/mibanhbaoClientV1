import { z } from "zod";

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const isValidPhoneDigits = (value: string) => /^\d{10,11}$/.test(value);

const trimmedString = (message: string) =>
  z
    .string()
    .trim()
    .min(1, { message });

const optionalTrimmedString = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "");

export const statusMessageSchema = z.object({
  type: z.enum(["error", "success", "info"]),
  text: z.string(),
});

export const profileFormSchema = z.object({
  name: trimmedString("Tên không được để trống"),
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => normalizePhone(value ?? ""))
    .refine((value) => value.length === 0 || isValidPhoneDigits(value), {
      message: "Số điện thoại phải có 10-11 chữ số",
    }),
});

export const addressFormSchema = z.object({
  name: trimmedString("Tên người nhận không được để trống"),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Số điện thoại không được để trống" })
    .transform((value) => normalizePhone(value))
    .refine((value) => isValidPhoneDigits(value), {
      message: "Số điện thoại phải có 10-11 chữ số",
    }),
  company: optionalTrimmedString(),
  addressLine: trimmedString("Địa chỉ chi tiết không được để trống"),
  province: trimmedString("Tỉnh/Thành phố không được để trống"),
  district: trimmedString("Quận/Huyện không được để trống"),
  ward: trimmedString("Phường/Xã không được để trống"),
});

export const passwordFormSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  newPassword: z
    .string()
    .trim()
    .min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
  confirmPassword: z
    .string()
    .trim()
    .min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
});

export const userSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((value) => String(value)),
  name: z.string(),
  email: z.string().trim().email(),
  phone: z.string().nullable().optional(),
  hasPassword: z.boolean().optional(),
});

export const addressSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  company: z.string().nullable().optional(),
  addressLine: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
});

export type StatusMessage = z.infer<typeof statusMessageSchema>;
export type ProfileForm = z.infer<typeof profileFormSchema>;
export type AddressForm = z.infer<typeof addressFormSchema>;
export type PasswordForm = z.infer<typeof passwordFormSchema>;
export type User = z.infer<typeof userSchema>;
export type Address = z.infer<typeof addressSchema>;
