"use client";

import { useCart, useClearCart } from "@/src/queries/useCart";
import { CartItemCard, CartSummary } from "@/src/components/features/cart";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/src/components/common/toast";
import { getApiErrorMessage } from "@/src/lib/error";
import styles from "./Cart.module.scss";

export default function CartPage() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const clearCart = useClearCart();
  const toast = useToast();

  const handleClearCart = async () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      try {
        await clearCart.mutateAsync();
        toast.success("Đã xóa toàn bộ giỏ hàng");
      } catch (error: unknown) {
        const errorMsg = getApiErrorMessage(error, "Không thể xóa giỏ hàng");
        toast.error(errorMsg);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h2>Đang tải giỏ hàng...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.empty}>
        <h2>Không thể tải giỏ hàng</h2>
        <p>Vui lòng kiểm tra kết nối và thử lại.</p>
        <button
          type="button"
          className={styles.continueBtn}
          onClick={() => {
            void refetch();
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className={styles.empty}>
        <ShoppingCart size={80} strokeWidth={1} />
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Link href="/" className={styles.continueBtn}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Giỏ hàng của bạn</h1>
          <button onClick={handleClearCart} className={styles.clearBtn}>
            <Trash2 size={18} />
            Xóa toàn bộ
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.items}>
            <div className={styles.itemsHeader}>
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Tổng</span>
            </div>
            {cart.items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className={styles.sidebar}>
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
