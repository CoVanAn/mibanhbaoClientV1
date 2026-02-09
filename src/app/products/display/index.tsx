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
    openFilterDrawer,
  } = context;

  return (
    <section className={styles.productGridSection}>
      {isTabletOrDown && (
        <div className={styles.sortRow}>
          <button
            className={styles.filterTrigger}
            type="button"
            onClick={openFilterDrawer}
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
