import { API_URL } from "@/src/constants/api";
import {
  ProductDetailSchema,
  ProductListSchema,
} from "@/src/schema/product.schema";
import type { ProductDetailData, ProductSummary } from "@/src/schema/product.schema";

type FetchProductListOptions = {
  categoryId?: number | null;
};

const assertSuccess = async (response: Response) => {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? "Không thể tải dữ liệu sản phẩm");
  }
  return payload;
};

const parseProductDetail = (payload: unknown): ProductDetailData => {
  const parsed = ProductDetailSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("Unexpected product detail shape", parsed.error);
    throw new Error("Dữ liệu sản phẩm không hợp lệ");
  }
  return parsed.data;
};

const parseProductList = (payload: unknown): ProductSummary[] => {
  const parsed = ProductListSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("Unexpected product list shape", parsed.error);
    throw new Error("Không thể tải danh sách sản phẩm");
  }
  return parsed.data;
};

export async function fetchProductBySlug(slug: string): Promise<ProductDetailData> {
  const response = await fetch(`${API_URL}/api/product/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  const payload = await assertSuccess(response);
  return parseProductDetail(payload);
}

export async function fetchProductList(
  options?: FetchProductListOptions,
): Promise<ProductSummary[]> {
  const params = new URLSearchParams();
  if (options?.categoryId) {
    params.append("categoryId", String(options.categoryId));
  }
  const query = params.toString();
  const url = `${API_URL}/api/product/list${query ? `?${query}` : ""}`;
  const response = await fetch(url, { cache: "no-store" });
  const payload = await assertSuccess(response);
  return parseProductList(payload);
}

export type { ProductSummary } from "@/src/schema/product.schema";
