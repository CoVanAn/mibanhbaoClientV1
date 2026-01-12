"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./FeaturedProduct.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CATEGORY_NAME = "Bột bánh bao trộn sẵn";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const slugify = (value) =>
  typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    : "";

export default function FeaturedProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const categoriesRes = await fetch(
          `${API_URL}/api/category/list?includeInactive=1`,
          { signal: controller.signal }
        );
        if (!categoriesRes.ok) {
          throw new Error("Không thể tải danh mục");
        }
        const categories = await categoriesRes.json();
        const targetCategory = categories.find(
          (category) => category.name?.trim() === CATEGORY_NAME
        );
        if (!targetCategory) {
          throw new Error("Danh mục bột bánh bao pha sẵn chưa được cấu hình");
        }

        const productsRes = await fetch(
          `${API_URL}/api/product/list?categoryId=${targetCategory.id}&limit=8`,
          { signal: controller.signal }
        );
        if (!productsRes.ok) {
          throw new Error("Không thể tải sản phẩm");
        }
        const payload = await productsRes.json();
        setProducts(Array.isArray(payload) ? payload : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  const renderCards = () => {
    if (loading) {
      return <p className="powder-grid__status">Đang tải sản phẩm…</p>;
    }
    if (error) {
      return <p className="powder-grid__status">{error}</p>;
    }
    if (products.length === 0) {
      return (
        <p className="powder-grid__status">Hiện chưa có sản phẩm phù hợp.</p>
      );
    }
    return products
      .map((product) => {
        const price = product.currentPrice ?? product.price ?? null;
        const linkTarget =
          product.slug ?? product.id ?? product._id ?? slugify(product.name);
        if (!linkTarget) {
          console.warn("Missing slug/id on product", product);
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
                <div className="powder-card__placeholder">
                  Hình ảnh đang cập nhật
                </div>
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
      })
      .filter(Boolean);
  };

  return (
    <section className="powder-showcase" aria-label="Danh mục bột bánh bao">
      <header className="powder-showcase__header">
        <h2>Bột bánh bao trộn sẵn</h2>
      </header>
      <div className="powder-grid">{renderCards()}</div>
    </section>
  );
}
