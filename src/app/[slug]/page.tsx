import { fetchProductBySlug } from "@/src/queries/product";
import { ProductDetailProvider } from "./ProductContent";
import ProductNotFound from "./ProductNotFound";
import ProductHero from "./ProductHero";
import ProductDescriptionSection from "./ProductDescription";
import BackToCatalog from "./BackToCatalog";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await fetchProductBySlug(slug);
  } catch (error) {
    console.error("Unable to load product", error);
    return <ProductNotFound />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <ProductDetailProvider product={product}>
      <main className={styles.productPage}>
        <ProductHero />
        <ProductDescriptionSection />
        <BackToCatalog />
      </main>
    </ProductDetailProvider>
  );
}
