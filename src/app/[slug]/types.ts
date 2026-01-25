export type Thumbnail = {
  id: string;
  url: string;
};

export type ProductVariant = {
  id: string;
  name?: string;
  price?: number | null;
  quantity?: number | null;
};
