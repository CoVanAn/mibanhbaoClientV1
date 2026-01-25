"use client";

import { createContext, useMemo } from "react";
import type { ProductDetailData } from "@/src/schema/product.schema";
import type { Thumbnail, ProductVariant } from "./types";

export interface ProductDetailContextType {
  product: ProductDetailData;
  categoryLabel: string;
  thumbnails: Thumbnail[];
  variants: ProductVariant[];
  mainImage: string | null;
}

export const ProductDetailContext =
  createContext<ProductDetailContextType | null>(null);

interface ProductDetailProviderProps {
  product: ProductDetailData;
  children: React.ReactNode;
}

export const ProductDetailProvider = ({
  product,
  children,
}: ProductDetailProviderProps) => {
  const categoryLabel = useMemo(
    () =>
      (product.categories || [])
        .map((category) => category.name)
        .filter(Boolean)
        .join(" ・ ") || "Chưa phân loại",
    [product],
  );

  const thumbnails = useMemo<Thumbnail[]>(
    () =>
      (product.images ?? [])
        .filter((image) => image.url)
        .slice(0, 4)
        .map((image) => ({ id: String(image.id), url: image.url })),
    [product],
  );

  const variants = useMemo<ProductVariant[]>(() => {
    const rawVariants = Array.isArray(product.variants) ? product.variants : [];
    if (rawVariants.length > 0) {
      return rawVariants.map((variant, index) => ({
        id: String(variant.id ?? index),
        name: variant.name ?? "Mặc định",
        price: variant.price ?? product.price,
        quantity: variant.quantity ?? 0,
      }));
    }

    return [
      {
        id: String(product.id),
        name: product.name,
        price: product.price,
        quantity: 0,
      },
    ];
  }, [product]);

  const mainImage = useMemo(() => {
    const image = product.image;

    if (Array.isArray(image) && image.length > 0) {
      return image[0]?.url ?? null;
    }

    if (typeof image === "string") {
      return image;
    }

    return null;
  }, [product]);

  const value: ProductDetailContextType = {
    product,
    categoryLabel,
    thumbnails,
    variants,
    mainImage,
  };

  return (
    <ProductDetailContext.Provider value={value}>
      {children}
    </ProductDetailContext.Provider>
  );
};
