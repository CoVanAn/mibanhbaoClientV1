"use client";

import { createContext, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProductList } from "@/src/queries/product";
import { fetchCategories } from "@/src/queries/category";
import type { ProductSummary } from "@/src/queries/product";
import type { CategorySummary } from "@/src/queries/category";
import type { PaginationData } from "@/src/schema/product.schema";
import { SortOption } from "./types";

const PRODUCTS_PER_PAGE = 9;

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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read page from URL, default to 1
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const currentPage = pageFromUrl > 0 ? pageFromUrl : 1;

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Fetch products with React Query
  const {
    data: productData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategoryId, currentPage],
    queryFn: () => fetchProductList({ 
      categoryId: selectedCategoryId,
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = productData?.data ?? [];
  const pagination = productData?.pagination ?? null;

  // Fetch categories with React Query
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
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

  // Update URL with new page number
  const updatePageInUrl = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page"); // Remove ?page=1 to keep URL clean
    } else {
      params.set("page", String(page));
    }
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products", { scroll: false });
  }, [router, searchParams]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    updatePageInUrl(1); // Reset to page 1 when category changes
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handlePageChange = (page: number) => {
    updatePageInUrl(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
