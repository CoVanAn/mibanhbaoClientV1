"use client";

import { useEffect } from "react";
import useStore from "@/src/store/useStore";
import "./FeaturedProduct.scss";
import {
  ProductCard,
  resolveProductSlug,
  buildProductKey,
} from "../Products/Product";

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
// .filter(Boolean);

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

export default function FeaturedProduct({ limit = 8 }) {
  const powderProducts = useStore((state: any) => state.powderProducts);
  const powderLoading = useStore((state: any) => state.powderLoading);
  const powderError = useStore((state: any) => state.powderError);
  const fetchPowderProducts = useStore(
    (state: any) => state.fetchPowderProducts,
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchPowderProducts(limit, controller.signal);
    return () => controller.abort();
  }, [fetchPowderProducts, limit]);

  return (
    <ProductSection
      title="Bột bánh bao trộn sẵn"
      ariaLabel="Danh mục bột bánh bao"
      products={powderProducts}
      loading={powderLoading}
      error={powderError}
      emptyMessage="Hiện chưa có sản phẩm phù hợp."
    />
  );
}

export function FeaturedProductsSection({ limit = 8 }) {
  const featuredProducts = useStore((state: any) => state.featuredProducts);
  const featuredLoading = useStore((state: any) => state.featuredLoading);
  const featuredError = useStore((state: any) => state.featuredError);
  const fetchFeaturedProducts = useStore(
    (state: any) => state.fetchFeaturedProducts,
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchFeaturedProducts(limit, controller.signal);
    return () => controller.abort();
  }, [fetchFeaturedProducts, limit]);

  return (
    <ProductSection
      title="Sản phẩm nổi bật"
      ariaLabel="Danh sách sản phẩm nổi bật"
      products={featuredProducts}
      loading={featuredLoading}
      error={featuredError}
      emptyMessage="Chưa có sản phẩm nổi bật nào."
    />
  );
}
