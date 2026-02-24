/**
 * Product API Requests
 * Product related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";
import {
  ProductDetailSchema,
  PaginatedProductListSchema,
} from "@/src/schema/product.schema";
import type {
  ProductDetailData,
  PaginatedProductListData,
} from "@/src/schema/product.schema";

export type FetchProductListOptions = {
  categoryId?: number | null;
  page?: number;
  limit?: number;
};

const parseProductDetail = (payload: unknown): ProductDetailData => {
  const parsed = ProductDetailSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("Unexpected product detail shape", parsed.error);
    throw new Error("Dữ liệu sản phẩm không hợp lệ");
  }
  return parsed.data;
};

const parsePaginatedProductList = (
  payload: unknown
): PaginatedProductListData => {
  const parsed = PaginatedProductListSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("Unexpected paginated product list shape", parsed.error);
    throw new Error("Không thể tải danh sách sản phẩm");
  }
  return parsed.data;
};

export const productAPI = {
  getBySlug: async (slug: string): Promise<ProductDetailData> => {
    const response = await apiClient.get(
      `/api/product/${encodeURIComponent(slug)}`
    );
    return parseProductDetail(response.data);
  },

  getList: async (
    options?: FetchProductListOptions
  ): Promise<PaginatedProductListData> => {
    const params = new URLSearchParams();
    if (options?.categoryId) {
      params.append("categoryId", String(options.categoryId));
    }
    if (options?.page) {
      params.append("page", String(options.page));
    }
    if (options?.limit) {
      params.append("limit", String(options.limit));
    }
    const query = params.toString();
    const url = `/api/product/list${query ? `?${query}` : ""}`;
    const response = await apiClient.get(url);
    return parsePaginatedProductList(response.data);
  },

  getFeatured: async (limit?: number): Promise<PaginatedProductListData> => {
    const params = new URLSearchParams();
    if (limit) {
      params.append("limit", String(limit));
    }
    const query = params.toString();
    const url = `/api/product/featured${query ? `?${query}` : ""}`;
    const response = await apiClient.get(url);
    return parsePaginatedProductList(response.data);
  },
};

// Export types for external use
export type {
  ProductDetailData,
  PaginatedProductListData,
} from "@/src/schema/product.schema";
export type { ProductSummary } from "@/src/schema/product.schema";
