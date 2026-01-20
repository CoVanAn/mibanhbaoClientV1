import { API_URL } from "@/src/constants/api";

export interface ProductVariantSummary {
  id: number;
  name?: string | null;
  sku?: string | null;
  isActive: boolean;
  price: number | null;
  currentPrice: number | null;
  quantity?: number | null;
  safetyStock?: number | null;
}

export interface ProductSummary {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number | null;
  currentPrice: number | null;
  createdAt?: string | null;
  categoryIds: number[];
  categoryNames: string[];
  isActive: boolean;
  isFeatured: boolean;
  variants: ProductVariantSummary[];
}

type FetchProductListOptions = {
  categoryId?: number | null;
};

async function assertSuccess(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }
  return payload;
}

export async function fetchProductBySlug(slug: string) {
  const response = await fetch(`${API_URL}/api/product/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  return (await assertSuccess(response)) as ProductSummary;
}

export async function fetchProductList(options?: FetchProductListOptions) {
  const params = new URLSearchParams();
  if (options?.categoryId) {
    params.append("categoryId", String(options.categoryId));
  }
  const query = params.toString();
  const url = `${API_URL}/api/product/list${query ? `?${query}` : ""}`;
  const response = await fetch(url, { cache: "no-store" });
  return (await assertSuccess(response)) as ProductSummary[];
}
