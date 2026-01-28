"use client";

import React, { useState } from "react";
import { useAddToCart } from "@/src/queries/cart";
// import { toast } from "sonner"; // Hoặc notification library bạn đang dùng
import styles from "./AddToCartButton.module.scss";

interface AddToCartButtonProps {
  productId: number;
  variantId: number;
  quantity: number;
  disabled?: boolean;
  inStock: number;
  productName?: string;
  variantName?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  variantId,
  quantity,
  disabled,
  inStock,
  productName,
  variantName,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    if (disabled || quantity <= 0 || quantity > inStock) return;

    setIsAdding(true);
    try {
      await addToCart.mutateAsync({
        productId,
        variantId,
        quantity,
      });

      // Show success state
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Optional: Show toast notification
      //   if (typeof toast !== "undefined") {
      //     toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      //   }
    } catch (error: any) {
      console.error("Failed to add to cart:", error);

      // Show error message
      const errorMsg =
        error.response?.data?.message || "Không thể thêm vào giỏ hàng";
      alert(errorMsg);
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled =
    disabled || quantity <= 0 || quantity > inStock || isAdding;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`${styles.addToCartBtn} ${showSuccess ? styles.success : ""}`}
    >
      {showSuccess ? (
        <>
          {/* <Check size={20} /> */}
          <span>Đã thêm vào giỏ</span>
        </>
      ) : isAdding ? (
        <>
          <div className={styles.spinner} />
          <span>Đang thêm...</span>
        </>
      ) : quantity > inStock ? (
        <>
          {/* <AlertCircle size={20} /> */}
          <span>Vượt quá tồn kho</span>
        </>
      ) : (
        <>
          {/* <ShoppingCart size={20} /> */}
          <span>Thêm vào giỏ hàng</span>
        </>
      )}
    </button>
  );
};
