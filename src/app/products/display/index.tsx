"use client";

import { useContext } from "react";
import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductsContext } from "../content";
import {
  ProductCard,
  buildProductKey,
  resolveProductSlug,
} from "../../../components/features/products";
import { Pagination } from "../../../components/common/pagination";
import { sortOptions } from "../types";
import styles from "./ProductDisplay.module.scss";

const ProductGridSection = () => {
  const context = useContext(ProductsContext);
  const isTabletOrDown = useIsMobile(1024);

  if (!context) return null;

  const {
    sortedProducts,
    isLoading,
    error,
    pagination,
    currentPage,
    handlePageChange,
    categories,
    selectedCategoryId,
    handleCategoryChange,
    sortOption,
    handleSortChange,
  } = context;

  return (
    <section className={styles.productGridSection}>
      {isTabletOrDown && (
        <div className={styles.mobileFilters}>
          <select
            className={styles.filterSelect}
            value={selectedCategoryId ?? "all"}
            onChange={(e) => {
              const value = e.target.value;
              handleCategoryChange(value === "all" ? null : Number(value));
            }}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value as any)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

      {!isLoading && !error && sortedProducts.length > 0 && pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default ProductGridSection;
