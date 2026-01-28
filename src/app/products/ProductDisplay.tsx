"use client";

import { useContext, useState, useEffect } from "react";
import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductsContext } from "./ProductsContext";
import {
  ProductCard,
  buildProductKey,
  resolveProductSlug,
} from "../../components/Products/Product";
import { sortOptions } from "./types";
import styles from "./page.module.scss";

export function ProductGridSection() {
  const context = useContext(ProductsContext);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isTabletOrDown = useIsMobile(1024);

  useEffect(() => {
    if (!isTabletOrDown) {
      setFiltersOpen(false);
    }
  }, [isTabletOrDown]);

  if (!context) return null;

  const {
    sortedProducts,
    isLoading,
    error,
    isFiltering,
    activeCategoryName,
    sortOption,
  } = context;

  const sortLabel = sortOptions.find(
    (option) => option.value === sortOption,
  )?.label;

  return (
    <section className={styles.productGridSection}>
      <div className={styles.gridHeader}>
        <div>
          <p className={styles.gridTitle}>{activeCategoryName}</p>
        </div>
        {isTabletOrDown && (
          <div className={styles.mobileFilterStatus}>
            <span className={styles.statusPill}>
              {isFiltering ? activeCategoryName : "Tất cả"}
            </span>
            <span className={styles.statusPill}>{sortLabel}</span>
          </div>
        )}
      </div>

      {isTabletOrDown && (
        <div className={styles.sortRow}>
          <button
            className={styles.filterTrigger}
            type="button"
            onClick={() => setFiltersOpen(true)}
          >
            Chọn bộ lọc
          </button>
        </div>
      )}

      {isLoading && <p className={styles.loading}>Đang tải sản phẩm...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!isLoading && !error && sortedProducts.length === 0 && (
        <div className={styles.noProducts}>
          <p>Hiện tại danh mục đang tạm thời hết sản phẩm!</p>
        </div>
      )}

      <div className={styles.productGrid}>
        {sortedProducts.map((product) => {
          const slug = resolveProductSlug(product);
          if (!slug) return null;
          return (
            <ProductCard
              key={buildProductKey(product, slug)}
              product={product}
            />
          );
        })}
      </div>
    </section>
  );
}
