import styles from "./page.module.scss";
import ProductHero from "./ProductHero";
import Link from "next/link";
import { fetchProductBySlug } from "@/src/queries/product";

type ProductDetailProps = {
  params: Promise<{ slug: string }>;
};

const ProductDetailContent = async ({ params }: ProductDetailProps) => {
  let product: any | null = null;

  try {
    const { slug } = await params;
    console.log("Slug:", slug);
    product = await fetchProductBySlug(slug);
  } catch (error) {
    console.error("Unable to load product", error);
  }

  if (!product) {
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

  const categoryLabel =
    (product.categories || [])
      .map((category: any) => category.name)
      .filter(Boolean)
      .join(" ・ ") || "Chưa phân loại";

  const mainImage = product.images?.[0]?.url ?? product.image;
  const thumbnails = (product.images ?? [])
    .filter((image: any) => image.url)
    .slice(0, 4)
    .map((image: any) => ({ id: image.id ?? image.url, url: image.url }));

  const rawVariants = Array.isArray(product.variants) ? product.variants : [];
  const variantOptions =
    rawVariants.length > 0
      ? rawVariants.map((variant: any, index: number) => ({
          id: variant.id ?? variant._id ?? `${product._id}-${index}`,
          name: variant.name ?? "Mặc định",
          price: variant.price ?? product.price,
          quantity: variant.quantity ?? 0,
        }))
      : [
          {
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: product.quantity ?? product.stock ?? 0,
          },
        ];

  return (
    <main className={styles.productPage}>
      <ProductHero
        categoryLabel={categoryLabel}
        name={product.name}
        description={product.description}
        defaultImage={mainImage}
        thumbnails={thumbnails}
        variants={variantOptions}
        isFeatured={product.isFeatured}
        isActive={product.isActive}
      />
      <div className={styles.detailPanel}>
        <h2>Giới thiệu sản phẩm</h2>
        {product.content ? (
          <div
            className={styles.richText}
            dangerouslySetInnerHTML={{ __html: product.content }}
          />
        ) : (
          <p>{product.description}</p>
        )}
      </div>
      <Link href="/products" className={styles.secondaryButton}>
        Xem danh mục
      </Link>
    </main>
  );
};

export default ProductDetailContent;
