"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useAddToCart } from "@/src/queries/useCart";
import { useToast } from "@/src/components/common/toast";
import styles from "./Variant.module.scss";

const formatCurrency = (value: number | null | undefined) =>
  value == null
    ? null
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);

type VariantOption = {
  id: string;
  name?: string;
  price?: number | null;
  quantity?: number | null;
};

type VariantSelectorProps = {
  variants: VariantOption[];
  productId?: number;
};

const VariantSelector = ({ variants, productId }: VariantSelectorProps) => {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(() =>
    variants[0]?.quantity && variants[0].quantity > 0 ? 1 : 0,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">(
    "idle",
  );

  const addToCart = useAddToCart();
  const toast = useToast();

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants[0],
    [selectedVariantId, variants],
  );

  const availableStock = Math.max(selectedVariant?.quantity ?? 0, 0);
  const canOrder = availableStock > 0;

  const handleSelectVariant = (variantId: string) => {
    const nextVariant =
      variants.find((variant) => variant.id === variantId) ?? variants[0];
    const nextStock = Math.max(nextVariant?.quantity ?? 0, 0);

    setSelectedVariantId(variantId);
    setStatusMessage("");
    setStatus("idle");
    setQuantity(nextStock > 0 ? 1 : 0);
  };

  const updateQuantity = (delta: number) => {
    if (!canOrder) return;
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > availableStock) return availableStock;
      return next;
    });
  };

  const handleQuantityInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canOrder) return;
    const value = parseInt(event.target.value, 10);
    if (Number.isNaN(value)) return;
    if (value < 1) {
      setQuantity(1);
      return;
    }
    if (value > availableStock) {
      setQuantity(availableStock);
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !canOrder || quantity <= 0 || !productId) return;
    const finalQuantity = Math.min(quantity, availableStock);

    if (finalQuantity <= 0) return;

    setStatus("adding");
    setStatusMessage("");

    try {
      await addToCart.mutateAsync({
        productId,
        variantId: Number(selectedVariant.id),
        quantity: finalQuantity,
      });
      setStatus("success");
      setStatusMessage(`Thêm giỏ hàng`);
      // toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);

      // Reset message after 3 seconds
      setTimeout(() => {
        setStatusMessage("");
        setStatus("idle");
      }, 3000);
    } catch (error: any) {
      console.error("Add to cart failed", error);
      setStatus("error");
      const errorMsg = error.response?.data?.message || "Vui lòng thử lại.";
      setStatusMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className={styles.variantSelector}>
      <div className={styles.variantOptions}>
        {variants.map((variant) => {
          // const variantStock = Math.max(variant.quantity ?? 0, 0);
          const isActive = variant.id === selectedVariant?.id;
          return (
            <button
              type="button"
              key={variant.id}
              className={`${styles.variantCard} ${
                isActive ? styles.variantCardActive : ""
              }`}
                onClick={() => handleSelectVariant(variant.id)}
            >
              <span className={styles.variantName}>{variant.name}</span>
              <span className={styles.variantPrice}>
                {formatCurrency(variant.price) ?? "Liên hệ"}
              </span>
              {/* <span className={styles.variantInventory}>
                {variantStock > 0 ? `Kho: ${variantStock}` : "Hết hàng"}
              </span> */}
            </button>
          );
        })}
      </div>

      <div className={styles.variantMeta}>
        <div className={styles.variantPriceLabel}>
          Giá: {formatCurrency(selectedVariant?.price ?? null) ?? "Liên hệ"}
        </div>
        <div className={styles.quantityRow}>
          <span>Số lượng</span>
          <div className={styles.quantityControls}>
            <button
              type="button"
              onClick={() => updateQuantity(-1)}
              disabled={!canOrder || quantity <= 1}
            >
              −
            </button>
            <input
              type="number"
              value={Math.max(quantity, canOrder ? 1 : 0)}
              min={canOrder ? 1 : 0}
              max={availableStock || 1}
              onChange={handleQuantityInput}
              disabled={!canOrder}
            />
            <button
              type="button"
              onClick={() => updateQuantity(1)}
              disabled={!canOrder || quantity >= availableStock}
            >
              +
            </button>
          </div>
        </div>
        <div className={styles.addToCartRow}>
          <p className={styles.stockInfo}>
            {canOrder ? `Còn ${availableStock} chiếc` : "Đang cập nhật kho"}
          </p>
          <button
            type="button"
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={!canOrder || status === "adding"}
          >
            {canOrder
              ? `Thêm ${quantity || 1} vào giỏ hàng`
              : "Sản phẩm hết hàng"}
          </button>
        </div>
        {statusMessage && (
          <p
            className={`${styles.variantStatus} ${
              status === "error"
                ? styles.variantStatusError
                : styles.variantStatusSuccess
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default VariantSelector;
