"use client";

import { Suspense } from "react";
import { ProductsProvider } from "./content";
import { ProductFilterPanel } from "./filter";
import ProductGridSection from "./display";
import styles from "./page.module.scss";

function ProductsContent() {
  return (
    <ProductsProvider>
      <div className={styles.productsPage}>
        <div className={styles.productsLayout}>
          <ProductFilterPanel />
          <ProductGridSection />
        </div>
      </div>
    </ProductsProvider>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className={styles.productsPage}>Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
