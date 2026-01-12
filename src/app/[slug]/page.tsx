import Link from "next/link";
import styles from "./page.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const formatCurrency = (value: number | null | undefined) =>
  value == null
    ? null
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);

async function fetchProductBySlug(slug: string) {
  const response = await fetch(
    `${API_URL}/api/product/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Product not found");
  }
  return response.json();
}

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
    .slice(0, 4);

  const priceLabel = formatCurrency(product.price);
  const variants = Array.isArray(product.variants) ? product.variants : [];

  return (
    <main className={styles.productPage}>
      <section className={styles.hero}>
        <div className={styles.heroInfo}>
          <p className={styles.categoryTag}>{categoryLabel}</p>
          <h1>{product.name}</h1>
          <div className={styles.heroBadges}>
            {product.isFeatured && (
              <span className={styles.badge}>Nổi bật</span>
            )}
            {product.isActive && (
              <span className={styles.badgeActive}>Đang bán</span>
            )}
          </div>
          <p className={styles.price}>{priceLabel ?? "Liên hệ để biết giá"}</p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.ctaGroup}>
            <Link href="/cart" className={styles.primaryButton}>
              Thêm vào giỏ
            </Link>
            <Link href="/products" className={styles.secondaryButton}>
              Xem danh mục
            </Link>
          </div>
        </div>
        <div className={styles.heroMedia}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className={styles.heroImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.heroPlaceholder}>Hình ảnh đang cập nhật</div>
          )}
          <div className={styles.thumbnails}>
            {thumbnails.map((image: any) => (
              <img
                key={image.id || image.url}
                src={image.url}
                alt={product.name}
                className={styles.thumbnail}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
      {/* <section className={styles.detailGrid}> */}
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
      <div className={styles.detailPanel}>
        <h2>Biến thể & tồn kho</h2>
        <ul className={styles.variantList}>
          {variants.length === 0 && (
            <li className={styles.variantItem}>Biến thể đang cập nhật</li>
          )}
          {variants.map((variant: any) => (
            <li key={variant.id} className={styles.variantItem}>
              <span>
                {variant.name || "Mặc định"} ・ {variant.sku || "SKU chưa có"}
              </span>
              <span className={styles.variantPrice}>
                {formatCurrency(variant.price) ?? "Liên hệ"}
              </span>
              <span className={styles.inventory}>
                Kho: {variant.quantity ?? "N/A"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* </section> */}
    </main>
  );
}
