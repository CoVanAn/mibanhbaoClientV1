"use client";

import { createContext, useMemo, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { productAPI, type ProductSummary } from "@/src/apiRequests/product";
import {
  categoryAPI,
  type CategorySummary,
} from "@/src/apiRequests/category";
import useIsMobile from "@/src/hooks/useIsMobile";
import type { PaginationData } from "@/src/schema/product.schema";
import { SortOption, sortOptions } from "./types";

const VALID_SORT_OPTIONS = sortOptions.map((opt) => opt.value);

interface ProductsContextType {
  products: ProductSummary[];
  categories: CategorySummary[];
  selectedCategoryId: number | null;
  sortOption: SortOption;
  isLoading: boolean;
  error: string | null;
  sortedProducts: ProductSummary[];
  activeCategoryName: string;
  isFiltering: boolean;
  // Pagination
  currentPage: number;
  pagination: PaginationData | null;
  // Filter drawer (mobile)
  isFilterDrawerOpen: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  handleCategoryChange: (categoryId: number | null) => void;
  handleSortChange: (option: SortOption) => void;
  handlePageChange: (page: number) => void;
}

export const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Desktop (>=1024): 9 products (3 columns x 3 rows)
  // Mobile (<1024): 8 products (2 columns x 4 rows)
  const isTabletOrDown = useIsMobile(1023);
  const perPage = isTabletOrDown ? 8 : 9;

  // Filter drawer state (mobile)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);
  const closeFilterDrawer = useCallback(() => setIsFilterDrawerOpen(false), []);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read all filters from URL
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const currentPage = pageFromUrl > 0 ? pageFromUrl : 1;

  const categoryFromUrl = searchParams.get("category");
  const selectedCategoryId = categoryFromUrl ? Number(categoryFromUrl) : null;

  const sortFromUrl = searchParams.get("sort") as SortOption | null;
  const sortOption: SortOption =
    sortFromUrl && VALID_SORT_OPTIONS.includes(sortFromUrl)
      ? sortFromUrl
      : "newest";

  // Fetch products with React Query
  const {
    data: productData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategoryId, currentPage],
    queryFn: () =>
      productAPI.getList({
        categoryId: selectedCategoryId,
        page: currentPage,
        limit: perPage,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = productData?.data ?? [];
  const pagination = productData?.pagination ?? null;

  // Fetch categories with React Query
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getList,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change rarely
  });

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortOption) {
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "newest":
      default:
        list.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        break;
    }
    return list;
  }, [products, sortOption]);

  const activeCategoryName =
    categories.find((cat) => cat.id === selectedCategoryId)?.name || "Tất cả";
  const isFiltering = Boolean(selectedCategoryId);

  // Update URL with filters
  const updateUrl = useCallback(
    (updates: {
      page?: number;
      category?: number | null;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Handle page
      if (updates.page !== undefined) {
        if (updates.page === 1) {
          params.delete("page");
        } else {
          params.set("page", String(updates.page));
        }
      }

      // Handle category
      if (updates.category !== undefined) {
        if (updates.category === null) {
          params.delete("category");
        } else {
          params.set("category", String(updates.category));
        }
        // Reset page when category changes
        params.delete("page");
      }

      // Handle sort
      if (updates.sort !== undefined) {
        if (updates.sort === "newest") {
          params.delete("sort");
        } else {
          params.set("sort", updates.sort);
        }
      }

      const queryString = params.toString();
      router.push(queryString ? `/products?${queryString}` : "/products", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const handleCategoryChange = useCallback(
    (categoryId: number | null) => {
      updateUrl({ category: categoryId });
    },
    [updateUrl],
  );

  const handleSortChange = useCallback(
    (option: SortOption) => {
      updateUrl({ sort: option });
    },
    [updateUrl],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({ page });
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateUrl],
  );

  const value: ProductsContextType = {
    products,
    categories,
    selectedCategoryId,
    sortOption,
    isLoading: isLoadingProducts,
    error: productsError?.message ?? null,
    sortedProducts,
    activeCategoryName,
    isFiltering,
    currentPage,
    pagination,
    isFilterDrawerOpen,
    openFilterDrawer,
    closeFilterDrawer,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
