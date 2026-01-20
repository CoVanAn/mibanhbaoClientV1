import { z } from "zod";
import {
  addressFormSchema,
  addressSchema,
  passwordFormSchema,
  profileFormSchema,
  statusMessageSchema,
  userSchema,
} from "../../schema/account.schema";

export type StatusMessage = z.infer<typeof statusMessageSchema>;
export type ProfileForm = z.infer<typeof profileFormSchema>;
export type AddressForm = z.infer<typeof addressFormSchema>;
export type PasswordForm = z.infer<typeof passwordFormSchema>;
export type User = z.infer<typeof userSchema>;
export type Address = z.infer<typeof addressSchema>;

export {
  profileFormSchema,
  addressFormSchema,
  passwordFormSchema,
  statusMessageSchema,
};
