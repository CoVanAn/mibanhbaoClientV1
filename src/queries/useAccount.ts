/**
 * Account Query Hooks
 * React Query hooks for user account operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountAPI } from "@/src/apiRequests/account";
import type { AddressForm, ProfileForm } from "@/src/apiRequests/account";
import useStore, { UserSlice } from "@/src/store/user";

// Query Keys
export const accountKeys = {
  all: ["account"] as const,
  profile: () => [...accountKeys.all, "profile"] as const,
  addresses: () => [...accountKeys.all, "addresses"] as const,
};

// Hooks
export const useProfile = () => {
  const token = useStore((state: UserSlice) => state.token);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);
  const scope = token ? "authenticated" : "guest";

  return useQuery({
    queryKey: [...accountKeys.profile(), scope],
    queryFn: accountAPI.getProfile,
    enabled: isInitialized && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: Omit<ProfileForm, "email">) => accountAPI.updateProfile(form),
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: accountKeys.profile() }, data);
    },
  });
};

export const useAddresses = (enabled: boolean = true) => {
  const token = useStore((state: UserSlice) => state.token);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);
  const scope = token ? "authenticated" : "guest";

  return useQuery({
    queryKey: [...accountKeys.addresses(), scope],
    queryFn: accountAPI.getAddresses,
    enabled: enabled && isInitialized && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
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
