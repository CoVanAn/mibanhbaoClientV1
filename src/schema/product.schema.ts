import { z } from "zod";

const ProductVariantSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  isActive: z.boolean(),
  price: z.coerce.number().nullable(),
  currentPrice: z.coerce.number().nullable(),
  quantity: z.coerce.number().nullable(),
  safetyStock: z.coerce.number().nullable(),
});

const ProductImageSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  position: z.number().optional(),
  alt: z.string().nullable().optional(),
});

const ProductCategorySchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
});

export const ProductDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  image: z.string().nullable().optional(),
  images: z.array(ProductImageSchema),
  price: z.coerce.number().nullable(),
  currentPrice: z.coerce.number().nullable(),
  variants: z.array(ProductVariantSchema),
  categories: z.array(ProductCategorySchema),
});

export type ProductDetailData = z.infer<typeof ProductDetailSchema>;
export type ProductVariantData = z.infer<typeof ProductVariantSchema>;

export const ProductSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  price: z.coerce.number().nullable(),
  currentPrice: z.coerce.number().nullable(),
  createdAt: z.string().nullable(),
  categoryIds: z.array(z.number()),
  categoryNames: z.array(z.string()),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  variants: z.array(ProductVariantSchema),
});

export type ProductSummary = z.infer<typeof ProductSummarySchema>;

export const ProductListSchema = z.array(ProductSummarySchema);
export type ProductListData = z.infer<typeof ProductListSchema>;

// Pagination response schema
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const PaginatedProductListSchema = z.object({
  data: z.array(ProductSummarySchema),
  pagination: PaginationSchema,
});

export type PaginationData = z.infer<typeof PaginationSchema>;
export type PaginatedProductListData = z.infer<typeof PaginatedProductListSchema>;