"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  useUpdateCartItem,
  useRemoveCartItem,
  type CartItem,
} from "@/src/queries/useCart";
import { useToast } from "@/src/components/common/toast";
import styles from "./Item.module.scss";

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const toast = useToast();

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0 || newQuantity > 999) return;

    setIsUpdating(true);
    try {
      if (newQuantity === 0) {
        await removeItem.mutateAsync(item.id);
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      } else {
        await updateItem.mutateAsync({
          itemId: item.id,
          quantity: newQuantity,
        });
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Không thể cập nhật số lượng";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
      try {
        await removeItem.mutateAsync(item.id);
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.message || "Không thể xóa sản phẩm";
        toast.error(errorMsg);
      }
    }
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  return (
    <div className={styles.cartItem}>
      {/* Product Image */}
      <div className={styles.image}>
        <Image
          src={item.productImage || "/placeholder.png"}
          alt={item.productName}
          width={80}
          height={80}
          className={styles.img}
        />
      </div>

      {/* Product Info */}
      <div className={styles.info}>
        <h4 className={styles.name}>{item.productName}</h4>
        <p className={styles.variant}>{item.variantName}</p>

        {!item.isAvailable && (
          <p className={styles.unavailable}>Sản phẩm không còn bán</p>
        )}
        {item.inStock < item.quantity && (
          <p className={styles.lowStock}>Chỉ còn {item.inStock} sản phẩm</p>
        )}
        <p className={styles.removeLink} onClick={handleRemove}>
          Xóa
        </p>
      </div>

      {/* Unit Price (Desktop only) */}
      <div className={styles.unitPrice}>{formatPrice(item.unitPrice)}</div>

      {/* Quantity Controls */}
      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={isUpdating}
            className={styles.quantityBtn}
          >
            <Minus size={16} />
          </button>
          <span className={styles.quantityValue}>{item.quantity}</span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= item.inStock}
            className={styles.quantityBtn}
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className={styles.removeBtn}
          title="Xóa sản phẩm"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className={styles.subtotal}>{formatPrice(item.subtotal)}</div>
    </div>
  );
};
