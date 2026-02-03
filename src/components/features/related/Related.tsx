"use client";

import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductDetailContext } from "../../../app/[slug]/ProductContent";
import { fetchProductList } from "@/src/queries/product";
import { ProductCard } from "@/src/components/features/products/Product";
import styles from "./Related.module.scss";

const RELATED_PRODUCTS_LIMIT = 6;

export default function RelatedProducts() {
  const context = useContext(ProductDetailContext);

  const categoryId = context?.product?.categories?.[0]?.id ?? null;
  const currentProductId = context?.product?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["relatedProducts", categoryId],
    queryFn: () =>
      fetchProductList({
        categoryId,
        limit: RELATED_PRODUCTS_LIMIT + 1, // +1 để loại trừ sản phẩm hiện tại
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });

  if (!categoryId || isLoading) {
    return null;
  }

  // Lọc bỏ sản phẩm hiện tại và giới hạn số lượng
  const relatedProducts = (data?.data ?? [])
    .filter((product) => product.id !== currentProductId)
    .slice(0, RELATED_PRODUCTS_LIMIT);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.title}>Sản phẩm cùng loại</h2>
      <div className={styles.productRow}>
        {relatedProducts.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
