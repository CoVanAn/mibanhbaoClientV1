"use client";

import { ProductSummary } from "@/src/queries/product";
import {
  ProductCard,
  buildProductKey,
  resolveProductSlug,
} from "../../components/Products/Product";
import { sortOptions, SortOption } from "./type";
import styles from "./page.module.scss";

type ProductGridSectionProps = {
  sortedProducts: ProductSummary[];
  isLoading: boolean;
  error: string | null;
  isTabletOrDown: boolean;
  isFiltering: boolean;
  activeCategoryName: string;
  sortOption: SortOption;
  openFilters: () => void;
};

export function ProductGridSection({
  sortedProducts,
  isLoading,
  error,
  isTabletOrDown,
  isFiltering,
  activeCategoryName,
  sortOption,
  openFilters,
}: ProductGridSectionProps) {
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
            onClick={openFilters}
          >
            Chọn bộ lọc
          </button>
        </div>
      )}

      {isLoading && <p className={styles.loading}>Đang tải sản phẩm...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!isLoading && !error && sortedProducts.length === 0 && (
        <p className={styles.noProducts}>
          Chưa có sản phẩm phù hợp với bộ lọc.
        </p>
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
