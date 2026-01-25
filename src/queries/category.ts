import apiClient from "@/src/lib/api";

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  position: number;
  isActive: boolean;
}

export async function fetchCategories(): Promise<CategorySummary[]> {
  const response = await apiClient.get("/api/category/list");
  return response.data as CategorySummary[];
}

