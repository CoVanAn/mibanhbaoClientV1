"use client";

import { ProductSummary } from "@/src/queries/product";
import {
  ProductCard,
  buildProductKey,
  resolveProductSlug,
} from "../../components/Products/Product";
import { sortOptions, SortOption } from "./productsConstants";

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
    <div className="product-grid-section">
      <div className="grid-header">
        <div>
          <p className="grid-title">{activeCategoryName}</p>
          <p className="grid-subtitle">
            Hiển thị {sortedProducts.length} món ・ {sortLabel}
          </p>
        </div>
        {isTabletOrDown && (
          <div className="mobile-filter-status">
            <span className="status-pill">
              {isFiltering ? activeCategoryName : "Tất cả"}
            </span>
            <span className="status-pill">{sortLabel}</span>
          </div>
        )}
      </div>

      {isTabletOrDown && (
        <div className="sort-row">
          <button
            className="filter-trigger"
            type="button"
            onClick={openFilters}
          >
            Chọn bộ lọc
          </button>
        </div>
      )}

      {isLoading && <p className="loading">Đang tải sản phẩm...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && sortedProducts.length === 0 && (
        <p className="no-products">Chưa có sản phẩm phù hợp với bộ lọc.</p>
      )}

      <div className="product-grid">
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
    </div>
  );
}
