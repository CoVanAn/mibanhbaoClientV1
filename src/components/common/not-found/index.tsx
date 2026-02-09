import Link from "next/link";
import styles from "./NotFound.module.scss";

export default function ProductNotFound() {
  return (
    <main className={styles.productPage}>
      <div className={styles.notFound}>
        <p>Không tìm thấy sản phẩm</p>
        <h1>Xin lỗi, sản phẩm đang được cập nhật.</h1>
        <Link href="/" className={styles.primaryButton}>
          Quay lại trang chủ
        </Link>
      </div>
    </main>
  );
}
