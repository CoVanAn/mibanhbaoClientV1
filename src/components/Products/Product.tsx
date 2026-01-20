"use client";

import Link from "next/link";
import "./Product.scss";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const slugify = (value: any) =>
  typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^\u0000-\u007f\p{L}\p{N}]+/gu, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    : "";

export function resolveProductSlug(product: any) {
  return (
    product.slug ?? product.id ?? product._id ?? slugify(product.name) ?? null
  );
}

export function buildProductKey(product: any, slug: string) {
  return `${product.id ?? product.slug ?? product._id}-${slug}`;
}

export function ProductCard({ product }: { product: any }) {
  const price =
    product.currentPrice != null ? product.currentPrice : product.price;

  const linkTarget = resolveProductSlug(product);

  if (!linkTarget) {
    console.warn("Product missing slug/id", product);
    return null;
  }

  return (
    <Link
      key={`${product.id ?? product.slug ?? product._id}-${linkTarget}`}
      href={`/${linkTarget}`}
      className="powder-card"
      aria-label={product.name}
    >
      <div className="powder-card__media">
        {product.isFeatured && (
          <span className="powder-card__badge">Nổi bật</span>
        )}
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="powder-card__placeholder">Hình ảnh đang cập nhật</div>
        )}
      </div>
      <div className="powder-card__body">
        <p className="powder-card__title">{product.name}</p>
        <div className="powder-card__price">
          <span>
            {price != null
              ? currencyFormatter.format(price)
              : "Liên hệ để biết giá"}
          </span>
          {product.price &&
            product.currentPrice != null &&
            product.currentPrice < product.price && (
              <del>{currencyFormatter.format(product.price)}</del>
            )}
        </div>
      </div>
    </Link>
  );
}
