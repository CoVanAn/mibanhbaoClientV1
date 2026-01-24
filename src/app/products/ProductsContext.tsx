"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProductSummary, fetchProductList } from "@/src/queries/product";
import { CategorySummary, fetchCategories } from "@/src/queries/category";
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
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProductList({
        categoryId: selectedCategoryId ?? undefined,
      });
      setProducts(data);
    } catch (fetchError) {
      console.error("fetchProductList", fetchError);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (fetchError) {
        console.error("fetchCategories", fetchError);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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
    isLoading,
    error,
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
