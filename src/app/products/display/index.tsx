"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { ProductsContext } from "../content";
import {
  ProductCard,
  buildProductKey,
  resolveProductSlug,
} from "../../../components/features/products";
import { Pagination } from "../../../components/common/pagination";
import { sortOptions, type SortOption } from "../types";
import styles from "./ProductDisplay.module.scss";

const ProductGridSection = () => {
  const context = useContext(ProductsContext);

  const [openCat, setOpenCat] = useState(false);
  const [openFil, setOpenFil] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

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

  // 👉 Click outside để đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setOpenCat(false);
      }

      if (sortRef.current && !sortRef.current.contains(target)) {
        setOpenFil(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name ||
    "Tất cả danh mục";

  const selectedFil = sortOptions.find((o) => o.value === sortOption);
  const selectedFilName = selectedFil ? selectedFil.label : "Sắp xếp";

  return (
    <section className={styles.productGridSection}>
      <div className={styles.mobileFilters}>
        <div
          ref={categoryRef}
          className={`${styles.filterSelect} ${openCat ? styles.open : ""}`}
        >
          <div
            className={styles.selected}
            onClick={() => setOpenCat((prev) => !prev)}
          >
            {selectedCategoryName}

            <span className={styles.icon}>▼</span>
          </div>

          <div className={`${styles.dropdown} ${openCat ? styles.open : ""}`}>
            <div
              className={!selectedCategoryId ? styles.active : ""}
              onClick={() => {
                handleCategoryChange(null);
                setOpenCat(false);
              }}
            >
              Tất cả danh mục
            </div>

            {categories.map((category) => (
              <div
                key={category.id}
                className={
                  selectedCategoryId === category.id ? styles.active : ""
                }
                onClick={() => {
                  handleCategoryChange(category.id);
                  setOpenCat(false);
                }}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        <div
          ref={sortRef}
          className={`${styles.filterSelect} ${openFil ? styles.open : ""}`}
        >
          <div
            className={styles.selected}
            onClick={() => setOpenFil((prev) => !prev)}
          >
            {selectedFilName}

            <span className={styles.icon}>▼</span>
          </div>

          <div className={`${styles.dropdown} ${openFil ? styles.open : ""}`}>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={sortOption === option.value ? styles.active : ""}
                onClick={() => {
                  handleSortChange(option.value);
                  setOpenFil(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>

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
