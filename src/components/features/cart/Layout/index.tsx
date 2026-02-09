"use client";

import React from "react";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useCart, useClearCart } from "@/src/queries/useCart";
import { useToast } from "@/src/components/common/toast";
import { CartItemCard } from "../Items";
import { CartSummary } from "../Summary";
import styles from "./Layout.module.scss";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { data: cart, isLoading } = useCart();
  const clearCart = useClearCart();
  const toast = useToast();

  const handleClearCart = async () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      try {
        await clearCart.mutateAsync();
        toast.success("Đã xóa toàn bộ giỏ hàng");
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.message || "Không thể xóa giỏ hàng";
        toast.error(errorMsg);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Drawer */}
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingCart size={24} />
            <h2>Giỏ hàng ({cart?.totalItems || 0})</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingCart size={64} />
              <p>Giỏ hàng trống</p>
              <button className={styles.continueBtn} onClick={onClose}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              {/* Clear all button */}
              {cart.items.length > 0 && (
                <button className={styles.clearAll} onClick={handleClearCart}>
                  <Trash2 size={16} />
                  Xóa tất cả
                </button>
              )}

              {/* Cart items */}
              <div className={styles.items}>
                {cart.items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Summary */}
              <CartSummary cart={cart} onCheckout={onClose} />
            </>
          )}
        </div>
      </div>
    </>
  );
};
