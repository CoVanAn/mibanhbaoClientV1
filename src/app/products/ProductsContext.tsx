"use client";

import { createContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductList } from "@/src/queries/product";
import { fetchCategories } from "@/src/queries/category";
import type { ProductSummary } from "@/src/queries/product";
import type { CategorySummary } from "@/src/queries/category";
import { SortOption } from "./types";

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
  handleCategoryChange: (categoryId: number | null) => void;
  handleSortChange: (option: SortOption) => void;
}

export const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Fetch products with React Query
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => fetchProductList({ categoryId: selectedCategoryId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
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
    handleCategoryChange,
    handleSortChange,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
