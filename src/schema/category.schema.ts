import { z } from "zod";

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    parentId: z.number().nullable().optional(),
    position: z.number(),
    isActive: z.boolean(),
});

export type CategoryData = z.infer<typeof CategorySchema>;

export const CategoryListSchema = z.array(CategorySchema);

export type CategoryListData = z.infer<typeof CategoryListSchema>;

