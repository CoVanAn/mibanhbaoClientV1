import { productAPI } from "@/src/apiRequests/product";
import { ProductDetailProvider } from "./ProductContent";
import ProductNotFound from "../../components/common/not-found/NotFound";
import { ProductHero } from "./hero";
import { ProductDescription } from "./description";
import RelatedProducts from "../../components/features/related/Related";
import BackToCatalog from "../../components/features/back/Back";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await productAPI.getBySlug(slug);
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
        <ProductDescription />
        <RelatedProducts />
        <BackToCatalog />
      </main>
    </ProductDetailProvider>
  );
}
