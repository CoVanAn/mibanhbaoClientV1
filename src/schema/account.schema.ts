import { z } from "zod";

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
  phone: optionalTrimmedString(),
});

export const addressFormSchema = z.object({
  name: trimmedString("Tên người nhận không được để trống"),
  phone: trimmedString("Số điện thoại không được để trống"),
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
  id: z.string(),
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

export type AddressSchemaType = z.TypeOf<typeof addressSchema>;
