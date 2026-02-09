"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, X } from "lucide-react";
import {
  type Cart,
  useApplyCoupon,
  useRemoveCoupon,
} from "@/src/queries/useCart";
import { useToast } from "@/src/components/common/toast";
import styles from "./Summary.module.scss";

interface CartSummaryProps {
  cart: Cart;
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onCheckout,
}) => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const toast = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponError("");
    try {
      await applyCoupon.mutateAsync(couponCode.trim().toUpperCase());
      setCouponCode("");
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Mã giảm giá không hợp lệ";
      setCouponError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon.mutateAsync();
      toast.success("Đã xóa mã giảm giá");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Không thể xóa mã giảm giá";
      toast.error(errorMsg);
    }
  };

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    router.push("/checkout");
  };

  const discount = cart.coupon
    ? cart.coupon.type === "PERCENTAGE"
      ? (cart.subtotal * cart.coupon.value) / 100
      : cart.coupon.value
    : 0;

  const total = cart.subtotal - discount;

  return (
    <div className={styles.summary}>
      {/* Coupon */}
      {!cart.coupon ? (
        <div className={styles.couponInput}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Nhập mã giảm giá"
            className={styles.input}
            onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || applyCoupon.isPending}
            className={styles.applyBtn}
          >
            {applyCoupon.isPending ? "..." : "Áp dụng"}
          </button>
        </div>
      ) : (
        <div className={styles.couponApplied}>
          <div className={styles.couponInfo}>
            <Tag size={16} />
            <span>{cart.coupon.code}</span>
            <span className={styles.couponValue}>
              -
              {cart.coupon.type === "PERCENTAGE"
                ? `${cart.coupon.value}%`
                : formatPrice(cart.coupon.value)}
            </span>
          </div>
          <button onClick={handleRemoveCoupon} className={styles.removeBtn}>
            <X size={16} />
          </button>
        </div>
      )}

      {couponError && <p className={styles.error}>{couponError}</p>}

      {/* Totals */}
      <div className={styles.totals}>
        <div className={styles.row}>
          <span>Tạm tính:</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>

        {cart.coupon && (
          <div className={styles.row}>
            <span>Giảm giá:</span>
            <span className={styles.discount}>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className={styles.row}>
          <span>Phí vận chuyển:</span>
          <span className={styles.shipping}>Tính khi thanh toán</span>
        </div>

        <div className={styles.divider} />

        <div className={`${styles.row} ${styles.total}`}>
          <span>Tổng cộng:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className={styles.checkoutBtn}
        disabled={!cart.items || cart.items.length === 0}
      >
        Tiến hành thanh toán
      </button>

      <p className={styles.note}>
        * Phí vận chuyển sẽ được tính tại trang thanh toán
      </p>
    </div>
  );
};
