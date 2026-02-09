"use client";

import { useContext } from "react";
import { ProductDetailContext } from "../content";
import styles from "./Description.module.scss";

export default function ProductDescriptionSection() {
  const context = useContext(ProductDetailContext);
  if (!context) return null;

  const { product } = context;

  return (
    <section className={styles.detailPanel}>
      <h2>Giới thiệu sản phẩm</h2>
      {product.content ? (
        <div
          className={styles.richText}
          dangerouslySetInnerHTML={{ __html: product.content }}
        />
      ) : (
        <p>{product.description}</p>
      )}
    </section>
  );
}
