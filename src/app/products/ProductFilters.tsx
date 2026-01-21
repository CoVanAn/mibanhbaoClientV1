"use client";

import { CategorySummary } from "@/src/queries/category";
import { sortOptions, SortOption } from "./type";
import styles from "./page.module.scss";

type BaseFilterProps = {
  categories: CategorySummary[];
  selectedCategoryId: number | null;
  handleCategoryChange: (categoryId: number | null) => void;
  sortOption: SortOption;
  handleSortChange: (option: SortOption) => void;
  closeFilters: () => void;
};

type FilterControlsProps = BaseFilterProps & { isTablet: boolean };

function FilterControls({
  categories,
  selectedCategoryId,
  handleCategoryChange,
  sortOption,
  handleSortChange,
  isTablet,
  closeFilters,
}: FilterControlsProps) {
  return (
    <div className={styles.filterContent}>
      <div className={styles.filterHeader}>
        <h3>Bộ lọc</h3>
        {isTablet && (
          <button
            type="button"
            className={styles.filterClose}
            onClick={closeFilters}
          >
            Đóng
          </button>
        )}
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

export function ProductFilterPanel(props: BaseFilterProps) {
  return (
    <aside className={styles.filterPanel}>
      <FilterControls {...props} isTablet={false} />
    </aside>
  );
}

export function ProductFilterDrawer(props: BaseFilterProps) {
  return (
    <div className={styles.filtersDrawerOverlay} onClick={props.closeFilters}>
      <div
        className={styles.filtersDrawer}
        onClick={(event) => event.stopPropagation()}
      >
        <FilterControls {...props} isTablet />
      </div>
    </div>
  );
}
