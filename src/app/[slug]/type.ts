import { fetchProductBySlug } from "@/src/queries/product";

type Product = any;

type DetailResult = {
  product: Product;
  categoryLabel: string;
  thumbnails: Array<{ id: string; url: string }>;
  variants: Array<{
    id: string;
    name?: string;
    price?: number | null;
    quantity?: number | null;
  }>;
  mainImage?: string | null;
} | null;

const buildCategoryLabel = (product: Product) =>
  (product.categories || [])
    .map((category: any) => category.name)
    .filter(Boolean)
    .join(" ・ ") || "Chưa phân loại";

const buildThumbnails = (product: Product) =>
  (product.images ?? [])
    .filter((image: any) => image.url)
    .slice(0, 4)
    .map((image: any) => ({ id: image.id ?? image.url, url: image.url }));

const buildVariants = (product: Product) => {
  const rawVariants = Array.isArray(product.variants) ? product.variants : [];
  if (rawVariants.length > 0) {
    return rawVariants.map((variant: any, index: number) => ({
      id: variant.id ?? variant._id ?? `${product._id}-${index}`,
      name: variant.name ?? "Mặc định",
      price: variant.price ?? product.price,
      quantity: variant.quantity ?? 0,
    }));
  }

  return [
    {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity ?? product.stock ?? 0,
    },
  ];
};

const buildMainImage = (product: Product): string | null => {
  const image = product.image;

  if (Array.isArray(image) && image.length > 0) {
    return image[0]?.url ?? null;
  }

  if (typeof image === "string") {
    return image;
  }

  return null;
};


export const getProductDetailData = async (
  params: Promise<{ slug: string }>,
): Promise<DetailResult> => {
  try {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);
    if (!product) {
      return null;
    }

    return {
      product,
      categoryLabel: buildCategoryLabel(product),
      thumbnails: buildThumbnails(product),
      variants: buildVariants(product),
      mainImage: buildMainImage(product),
    };
  } catch (error) {
    console.error("Unable to load product", error);
    return null;
  }
};
