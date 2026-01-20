export type SortOption = "newest" | "price-desc" | "price-asc";

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Hàng mới nhất" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "price-asc", label: "Giá tăng dần" },
];
