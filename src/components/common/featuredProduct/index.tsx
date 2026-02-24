"use client";

import "./FeaturedProduct.scss";
import {
  ProductCard,
  resolveProductSlug,
  buildProductKey,
} from "../../features/products";
import Link from "next/dist/client/link";
import {
  usePowderProducts,
  useFeaturedProducts,
} from "@/src/queries/useProduct";

const renderProductCards = (products: any[]) =>
  products
    .map((product: any) => {
      const linkTarget = resolveProductSlug(product);
      if (!linkTarget) {
        console.warn("Missing slug/id on product", product);
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
  products: any[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
}) {
  let statusNode = null;
  if (loading) {
    statusNode = <p className="powder-grid__status">Đang tải sản phẩm…</p>;
  } else if (error) {
    statusNode = <p className="powder-grid__status">{error}</p>;
  } else if (!products.length) {
    statusNode = (
      <p className="powder-grid__status">
        {emptyMessage ?? "Không có sản phẩm"}
      </p>
    );
  }

  return (
    <section className="powder-showcase" aria-label={ariaLabel}>
      <header className="powder-showcase__header">
        <h2>{title}</h2>
      </header>
      <div className="powder-grid">
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
      <br />
      <ProductSection
        title="Sản phẩm nổi bật"
        ariaLabel="Danh sách sản phẩm nổi bật"
        products={products}
        loading={isLoading}
        error={error ? "Không thể tải sản phẩm nổi bật" : null}
        emptyMessage="Chưa có sản phẩm nổi bật nào."
      />
      <Link href="/products" className="featured-more-link">
        Xem tất cả sản phẩm
      </Link>
    </>
  );
}
