"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductSummary, fetchProductList } from "@/src/queries/product";
import { CategorySummary, fetchCategories } from "@/src/queries/category";
import { ProductFilterDrawer, ProductFilterPanel } from "./ProductFilters";
import { ProductGridSection } from "./ProductDisplay";
import { SortOption } from "./type";
import styles from "./page.module.scss";

export default function ProductsCatalog() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isTabletOrDown = useIsMobile(1024);

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

  useEffect(() => {
    if (!isTabletOrDown) {
      setFiltersOpen(false);
    }
  }, [isTabletOrDown]);

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
    if (isTabletOrDown) {
      setFiltersOpen(false);
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    if (isTabletOrDown) {
      setFiltersOpen(false);
    }
  };

  const openFilters = () => setFiltersOpen(true);
  const closeFilters = () => setFiltersOpen(false);

  const filterProps = {
    categories,
    selectedCategoryId,
    handleCategoryChange,
    sortOption,
    handleSortChange,
    closeFilters,
  };

  return (
    <div className={styles.productsPage}>
      <div className={styles.productsLayout}>
        {!isTabletOrDown && <ProductFilterPanel {...filterProps} />}

        <ProductGridSection
          sortedProducts={sortedProducts}
          isLoading={isLoading}
          error={error}
          isTabletOrDown={isTabletOrDown}
          isFiltering={isFiltering}
          activeCategoryName={activeCategoryName}
          sortOption={sortOption}
          openFilters={openFilters}
        />
      </div>

      {isTabletOrDown && filtersOpen && (
        <ProductFilterDrawer {...filterProps} />
      )}
    </div>
  );
}
