"use client";

import { useContext } from "react";
import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductsContext } from "../content";
import { sortOptions } from "../types";
import styles from "./ProductFilters.module.scss";

function FilterControls({ isTablet }: { isTablet: boolean }) {
  const context = useContext(ProductsContext);
  if (!context) return null;

  const {
    categories,
    selectedCategoryId,
    handleCategoryChange,
    sortOption,
    handleSortChange,
  } = context;

  return (
    <div className={styles.filterContent}>
      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Danh mục</p>
        <div className={styles.categoryList}>
          <button
            type="button"
            className={`${styles.categoryItem} ${!selectedCategoryId ? styles.categoryItemActive : ""}`}
            onClick={() => handleCategoryChange(null)}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`${styles.categoryItem} ${
                selectedCategoryId === category.id
                  ? styles.categoryItemActive
                  : ""
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Sắp xếp</p>
        <div className={styles.sortOptions}>
          {sortOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`${styles.sortButton} ${
                sortOption === option.value ? styles.sortButtonActive : ""
              }`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductFilterPanel() {
  return (
    <aside className={styles.filtersPanel}>
      <FilterControls isTablet={false} />
    </aside>
  );
}

export function ProductFilterDrawer() {
  const context = useContext(ProductsContext);
  const isTabletOrDown = useIsMobile(1024);

  if (!context || !isTabletOrDown || !context.isFilterDrawerOpen) return null;

  const { closeFilterDrawer } = context;

  return (
    <div className={styles.filtersDrawerOverlay} onClick={closeFilterDrawer}>
      <div
        className={styles.filtersDrawer}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.filterHeader}>
          <h3>Bộ lọc</h3>
          <button
            type="button"
            className={styles.filterClose}
            onClick={closeFilterDrawer}
          >
            Đóng
          </button>
        </div>
        <FilterControls isTablet />
      </div>
    </div>
  );
}
