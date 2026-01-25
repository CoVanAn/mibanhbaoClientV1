import Link from "next/link";
import styles from "./page.module.scss";

export default function BackToCatalog() {
  return (
    <Link href="/products" className={styles.backToCatalog}>
      ← Quay lại danh mục sản phẩm
    </Link>
  );
}
