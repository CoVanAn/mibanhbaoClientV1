/**
 * Category API Requests
 * Category related API functions that call backend directly via axios
 */

import apiClient from "@/src/lib/axios";

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  position: number;
  isActive: boolean;
}

export const categoryAPI = {
  getList: async (): Promise<CategorySummary[]> => {
    const response = await apiClient.get("/api/category/list");
    return response.data as CategorySummary[];
  },
};
