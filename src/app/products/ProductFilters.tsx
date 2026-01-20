"use client";

import { CategorySummary } from "@/src/queries/category";
import { sortOptions, SortOption } from "./productsConstants";

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
    <div className="filter-content">
      <div className="filter-header">
        <h3>Bộ lọc</h3>
        {isTablet && (
          <button type="button" className="filter-close" onClick={closeFilters}>
            Đóng
          </button>
        )}
      </div>

      <div className="filter-group">
        <p className="filter-title">Danh mục</p>
        <div className="category-list">
          <button
            type="button"
            className={`category-item ${!selectedCategoryId ? "is-active" : ""}`}
            onClick={() => handleCategoryChange(null)}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`category-item ${selectedCategoryId === category.id ? "is-active" : ""}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-title">Sắp xếp</p>
        <div className="sort-options">
          {sortOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`sort-button ${sortOption === option.value ? "is-active" : ""}`}
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
    <aside className="filter-panel">
      <FilterControls {...props} isTablet={false} />
    </aside>
  );
}

export function ProductFilterDrawer(props: BaseFilterProps) {
  return (
    <div className="filters-drawer-overlay" onClick={props.closeFilters}>
      <div
        className="filters-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <FilterControls {...props} isTablet />
      </div>
    </div>
  );
}
