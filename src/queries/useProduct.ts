/**
 * Product Query Hooks
 * React Query hooks for product operations
 */

import { useQuery } from "@tanstack/react-query";
import { productAPI, type FetchProductListOptions } from "@/src/apiRequests/product";
import { useCategories } from "./useCategory";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (options?: FetchProductListOptions) => [...productKeys.lists(), options] as const,
  featured: (limit?: number) => [...productKeys.lists(), "featured", limit] as const,
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
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: productKeys.featured(limit),
    queryFn: () => productAPI.getFeatured(limit),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

/**
 * Hook để lấy sản phẩm bột bánh bao trộn sẵn
 * Tự động tìm category theo tên và fetch products
 */
export const usePowderProducts = (limit?: number, categoryName: string = "Bột bánh bao trộn sẵn") => {
  // Fetch categories trước
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Tìm category ID từ tên
  const targetCategory = categories?.find(
    (cat) => cat.name?.trim() === categoryName
  );

  // Fetch products với category ID (chỉ khi đã có category)
  const productsQuery = useQuery({
    queryKey: productKeys.list({ categoryId: targetCategory?.id ?? null, limit }),
    queryFn: () => productAPI.getList({ categoryId: targetCategory!.id, limit }),
    enabled: !!targetCategory?.id, // Chỉ fetch khi có category ID
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  return {
    data: productsQuery.data,
    isLoading: categoriesLoading || productsQuery.isLoading,
    error: productsQuery.error ? "Không thể tải sản phẩm" : !targetCategory && !categoriesLoading ? "Danh mục bột bánh bao pha sẵn chưa được cấu hình" : null,
  };
};

// Re-export types for convenience
export type { ProductDetailData, PaginatedProductListData, ProductSummary, FetchProductListOptions } from "@/src/apiRequests/product";
