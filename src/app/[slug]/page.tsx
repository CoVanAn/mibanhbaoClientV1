import ProductDetailContent from "./ProductDetail";

export const dynamic = "force-dynamic";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProductDetailContent params={params} />;
}
