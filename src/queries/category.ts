import { API_URL } from "@/src/constants/api";

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  position: number;
  isActive: boolean;
}

async function handleResponse(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? "Unable to load categories");
  }
  return payload;
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/category/list`, {
    cache: "no-store",
  });
  return (await handleResponse(response)) as CategorySummary[];
}
