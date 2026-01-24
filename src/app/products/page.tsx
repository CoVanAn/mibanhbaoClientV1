"use client";

import useIsMobile from "@/src/hooks/useIsMobile";
import { ProductsProvider } from "./ProductsContext";
import { ProductFilterPanel, ProductFilterDrawer } from "./ProductFilters";
import { ProductGridSection } from "./ProductDisplay";
import styles from "./page.module.scss";

export default function Page() {
  const isTabletOrDown = useIsMobile(1024);

  return (
    <ProductsProvider>
      <div className={styles.productsPage}>
        <div className={styles.productsLayout}>
          {!isTabletOrDown && <ProductFilterPanel />}
          <ProductGridSection />
        </div>
        {isTabletOrDown && <ProductFilterDrawer />}
      </div>
    </ProductsProvider>
  );
}
