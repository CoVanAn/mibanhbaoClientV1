/**
 * Category Query Hooks
 * React Query hooks for category operations
 */

import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/src/app/api/category/route";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
};

// Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoryAPI.getList,
  });
};

// Re-export types for convenience
export type { CategorySummary } from "@/src/app/api/category/route";
