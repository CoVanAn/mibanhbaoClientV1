"use client";

import { Suspense } from "react";
import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductsProvider } from "./content";
import { ProductFilterPanel } from "./filter";
import ProductGridSection from "./display";
import styles from "./page.module.scss";

function ProductsContent() {
  const isTabletOrDown = useIsMobile(1024);

  return (
    <ProductsProvider>
      <div className={styles.productsPage}>
        <div className={styles.productsLayout}>
          {!isTabletOrDown && <ProductFilterPanel />}
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
