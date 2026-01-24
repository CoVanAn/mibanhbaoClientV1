"use client";

import { useContext, useEffect, useState } from "react";
import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductsContext } from "./ProductsContext";
import { sortOptions } from "./types";
import styles from "./page.module.scss";

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
      <div className={styles.filterHeader}>
        <h3>Bộ lọc</h3>
      </div>

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
  const [isOpen, setIsOpen] = useState(false);
  const isTabletOrDown = useIsMobile(1024);

  useEffect(() => {
    if (!isTabletOrDown) {
      setIsOpen(false);
    }
  }, [isTabletOrDown]);

  if (!isTabletOrDown || !isOpen) return null;

  return (
    <div
      className={styles.filtersDrawerOverlay}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={styles.filtersDrawer}
        onClick={(event) => event.stopPropagation()}
      >
        <FilterControls isTablet />
      </div>
    </div>
  );
}
