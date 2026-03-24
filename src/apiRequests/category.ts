/**
 * Category API Requests
 * Category related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";
import {
  CategoryListSchema,
  type CategoryData,
} from "@/src/schema/category.schema";

const parseCategoryList = (payload: unknown): CategoryData[] => {
  const parsed = CategoryListSchema.safeParse(payload);

  if (!parsed.success) {
    console.error("Unexpected category list shape", parsed.error);
    throw new Error("Không thể tải danh mục");
  }

  return parsed.data;
};

export const categoryAPI = {
  getList: async (): Promise<CategoryData[]> => {
    const response = await apiClient.get("/api/category/list");
    return parseCategoryList(response.data);
  },
};

export type { CategoryData as CategorySummary };
