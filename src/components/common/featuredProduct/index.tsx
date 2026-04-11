"use client";

import styles from "./FeaturedProduct.module.scss";
import {
  ProductCard,
  resolveProductSlug,
  buildProductKey,
} from "../../features/products";
import Link from "next/link";
import type { ProductSummary } from "@/src/apiRequests/product";
import {
  usePowderProducts,
  useFeaturedProducts,
} from "@/src/queries/useProduct";

const renderProductCards = (products: ProductSummary[]) =>
  products
    .map((product) => {
      const linkTarget = resolveProductSlug(product);
      if (!linkTarget) {
        return null;
      }
      return (
        <ProductCard
          key={buildProductKey(product, linkTarget)}
          product={product}
        />
      );
    })
    .filter(Boolean);

function ProductSection({
  title,
  ariaLabel,
  products,
  loading,
  error,
  emptyMessage,
}: {
  title: string;
  ariaLabel: string;
  products: ProductSummary[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
}) {
  let statusNode = null;
  if (loading) {
    statusNode = <p className={styles.powderGridStatus}>Đang tải sản phẩm…</p>;
  } else if (error) {
    statusNode = <p className={styles.powderGridStatus}>{error}</p>;
  } else if (!products.length) {
    statusNode = (
      <p className={styles.powderGridStatus}>
        {emptyMessage ?? "Không có sản phẩm"}
      </p>
    );
  }

  return (
    <section className={styles.powderShowcase} aria-label={ariaLabel}>
      <header className={styles.powderShowcaseHeader}>
        <h2>{title}</h2>
      </header>
      <div className={styles.powderGrid}>
        {statusNode ?? renderProductCards(products)}
      </div>
    </section>
  );
}

export default function FeaturedProduct({ limit = 10 }) {
  const { data, isLoading, error } = usePowderProducts(limit);
  const products = data?.data ?? [];

  return (
    <ProductSection
      title="Bột bánh bao trộn sẵn"
      ariaLabel="Danh mục bột bánh bao"
      products={products}
      loading={isLoading}
      error={error}
      emptyMessage="Hiện chưa có sản phẩm phù hợp."
    />
  );
}

export function FeaturedProductsSection({ limit = 100 }) {
  const { data, isLoading, error } = useFeaturedProducts(limit);
  const products = data?.data ?? [];

  return (
    <>
      <ProductSection
        title="Sản phẩm nổi bật"
        ariaLabel="Danh sách sản phẩm nổi bật"
        products={products}
        loading={isLoading}
        error={error ? "Không thể tải sản phẩm nổi bật" : null}
        emptyMessage="Chưa có sản phẩm nổi bật nào."
      />
      <Link href="/products" className={styles.featuredMoreLink}>
        Xem tất cả sản phẩm
      </Link>
    </>
  );
}
