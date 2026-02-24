/**
 * DEPRECATED: Product store is no longer used
 * All product fetching has been migrated to React Query hooks
 * 
 * Use these instead:
 * - useProduct(slug) - Get product by slug
 * - useProductList(options) - Get paginated product list
 * - useFeaturedProducts(limit) - Get featured products
 * - usePowderProducts(limit) - Get powder products by category
 * 
 * @see src/queries/useProduct.ts
 * @see src/apiRequests/product.ts
 */

import axios from "axios";
import { API_URL, POWDER_CATEGORY_NAME } from "@/src/store/constants";

const createProductSlice = (set: any) => ({
  url: API_URL,
  
  // DEPRECATED: Use React Query hooks instead
  food_list: [],
  powderProducts: [],
  powderLoading: false,
  powderError: "",
  featuredProducts: [],
  featuredLoading: false,
  featuredError: "",

  // DEPRECATED: Use useProductList() hook instead
  fetchFoodList: async () => {
    console.warn("fetchFoodList is deprecated. Use useProductList() hook instead.");
    try {
      const response = await axios.get(`${API_URL}/api/food/list`);
      set({ food_list: response.data });
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  },

  // DEPRECATED: Use usePowderProducts() hook instead
  fetchPowderProducts: async (limit = 8, signal: AbortSignal) => {
    console.warn("fetchPowderProducts is deprecated. Use usePowderProducts() hook instead.");
    set({ powderLoading: true, powderError: "", powderProducts: [] });
    try {
      const categoriesRes = await fetch(
        `${API_URL}/api/category/list?includeInactive=1`,
        { signal }
      );
      if (!categoriesRes.ok) {
        throw new Error("Không thể tải danh mục");
      }
      const categories = await categoriesRes.json();
      const targetCategory = categories.find(
        (category: any) => category.name?.trim() === POWDER_CATEGORY_NAME
      );
      if (!targetCategory) {
        throw new Error("Danh mục bột bánh bao pha sẵn chưa được cấu hình");
      }

      const productsRes = await fetch(
        `${API_URL}/api/product/list?categoryId=${targetCategory.id}&limit=${limit}`,
        { signal }
      );
      if (!productsRes.ok) {
        throw new Error("Không thể tải sản phẩm");
      }
      const payload = await productsRes.json();
      const products = payload?.data ?? payload;
      set({
        powderProducts: Array.isArray(products) ? products : [],
        powderError: "",
      });
    } catch (error) {
      if (signal?.aborted) return;
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Lỗi tải dữ liệu";
      set({ powderError: message, powderProducts: [] });
    } finally {
      set({ powderLoading: false });
    }
  },

  // DEPRECATED: Use useFeaturedProducts() hook instead
  fetchFeaturedProducts: async (limit = 100, signal: AbortSignal) => {
    console.warn("fetchFeaturedProducts is deprecated. Use useFeaturedProducts() hook instead.");
    set({ featuredLoading: true, featuredError: "", featuredProducts: [] });
    try {
      const productsRes = await fetch(
        `${API_URL}/api/product/featured?limit=${limit}`,
        { signal }
      );
      if (!productsRes.ok) {
        throw new Error("Không thể tải sản phẩm nổi bật");
      }
      const payload = await productsRes.json();
      set({
        featuredProducts: Array.isArray(payload) ? payload : [],
        featuredError: "",
      });
    } catch (error) {
      if (signal?.aborted) return;
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Lỗi tải dữ liệu";
      set({ featuredError: message, featuredProducts: [] });
    } finally {
      set({ featuredLoading: false });
    }
  },
});

export default createProductSlice;
