/**
 * Product Query Hooks
 * React Query hooks for product operations
 */

import { useQuery } from "@tanstack/react-query";
import { productAPI, type FetchProductListOptions } from "@/src/apiRequests/product";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (options?: FetchProductListOptions) => [...productKeys.lists(), options] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

// Hooks
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productAPI.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useProductList = (options?: FetchProductListOptions) => {
  return useQuery({
    queryKey: productKeys.list(options),
    queryFn: () => productAPI.getList(options),
  });
};

// Re-export types for convenience
export type { ProductDetailData, PaginatedProductListData, ProductSummary, FetchProductListOptions } from "@/src/apiRequests/product";
