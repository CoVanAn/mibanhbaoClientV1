/**
 * Account Query Hooks
 * React Query hooks for user account operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountAPI } from "@/src/apiRequests/account";
import type { AddressForm, ProfileForm } from "@/src/apiRequests/account";

// Query Keys
export const accountKeys = {
  all: ["account"] as const,
  profile: () => [...accountKeys.all, "profile"] as const,
  addresses: () => [...accountKeys.all, "addresses"] as const,
};

// Hooks
export const useProfile = () => {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: accountAPI.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: ProfileForm) => accountAPI.updateProfile(form),
    onSuccess: (data) => {
      queryClient.setQueryData(accountKeys.profile(), data);
    },
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: accountKeys.addresses(),
    queryFn: accountAPI.getAddresses,
  });
};

export const useSaveAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ form, addressId }: { form: AddressForm; addressId?: number }) =>
      accountAPI.saveAddress(form, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.addresses() });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => accountAPI.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.addresses() });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      accountAPI.changePassword(currentPassword, newPassword),
  });
};

// Re-export types for convenience
export type { Address, AddressForm, ProfileForm, User } from "@/src/apiRequests/account";
