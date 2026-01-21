import Link from "next/link";
import styles from "./page.module.scss";
import ProductHero from "./ProductHero";
import ProductDescriptionSection from "./ProductDescription";
import { getProductDetailData } from "./type";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const detail = await getProductDetailData(params);

  if (!detail) {
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

  const { product, categoryLabel, thumbnails, variants, mainImage } = detail;

  return (
    <main className={styles.productPage}>
      <ProductHero
        categoryLabel={categoryLabel}
        name={product.name}
        description={product.description}
        defaultImage={mainImage}
        thumbnails={thumbnails}
        variants={variants}
        isFeatured={product.isFeatured}
        isActive={product.isActive}
      />
      <ProductDescriptionSection
        content={product.content}
        description={product.description}
      />
      <Link href="/products" className={styles.backToCatalog}>
        ← Quay lại danh mục sản phẩm
      </Link>
    </main>
  );
}
