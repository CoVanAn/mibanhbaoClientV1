"use client";

import { useRouter } from "next/navigation";
import styles from "./Back.module.scss";

export default function BackToCatalog() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/products");
    }
  };

  return (
    <button onClick={handleBack} className={styles.backToCatalog}>
      ← Quay lại danh mục sản phẩm
    </button>
  );
}
