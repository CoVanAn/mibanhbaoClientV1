import z from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  mainImage: z.string().url(),
  images: z.array(z.string().url()),
  variants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      sku: z.string().nullable().optional(),
      stock: z.number().nullable().optional(),
    })
  ),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductType = z.TypeOf<typeof ProductSchema>;

export const ProductListSchema = z.array(ProductSchema);

export type ProductListType = z.TypeOf<typeof ProductListSchema>;

export const ProductDetailSchema = z.object({
    categoryLabel: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  defaultImage: z.string().url().nullable().optional(),
  thumbnails: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
    })
  ),
  variants: z.array(
    z.object({
    id: z.string(),
    name: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    quantity: z.number().nullable().optional(),
  })),
  isFeatured: z.boolean().nullable().optional(),
  isActive: z.boolean().nullable().optional(),   
});

export type ProductDetailData = z.TypeOf<typeof ProductDetailSchema>;

export type ProductDetailType = {
  data: ProductDetailData | null;
};