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

function Pagination() {
  const context = useContext(ProductsContext);
  if (!context || !context.pagination) return null;

  const { currentPage, pagination, handlePageChange } = context;
  const { totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Trang trước"
      >
        ‹
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
            {page}
          </span>
        ),
      )}

      <button
        className={styles.paginationBtn}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Trang sau"
      >
        ›
      </button>
    </div>
  );
}

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
    pagination,
  } = context;

  const sortLabel = sortOptions.find(
    (option) => option.value === sortOption,
  )?.label;

  return (
    <section className={styles.productGridSection}>
      {/* <div className={styles.gridHeader}>
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
      </div> */}

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

      {!isLoading && !error && sortedProducts.length > 0 && <Pagination />}
    </section>
  );
}
