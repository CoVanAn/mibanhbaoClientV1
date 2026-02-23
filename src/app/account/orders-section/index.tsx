"use client";

import Link from "next/link";
import { useMyOrders } from "@/src/queries/useOrder";
import { Package, ChevronRight } from "lucide-react";
import styles from "./orders.module.scss";

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xác nhận", color: "#f59e0b" },
  CONFIRMED: { label: "Đã xác nhận", color: "#3b82f6" },
  PREPARING: { label: "Đang chuẩn bị", color: "#8b5cf6" },
  READY: { label: "Sẵn sàng", color: "#06b6d4" },
  OUT_FOR_DELIVERY: { label: "Đang giao", color: "#0891b2" },
  COMPLETED: { label: "Đã hoàn thành", color: "#10b981" },
  CANCELED: { label: "Đã hủy", color: "#ef4444" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#6b7280" },
};

export default function OrdersSection() {
  const { data, isLoading } = useMyOrders({ page: 1, limit: 5 });

  const orders = data?.orders || [];

  return (
    <section className={styles.ordersSection}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Package size={24} className={styles.icon} />
          <h2>Đơn hàng gần đây</h2>
        </div>
        <Link href="/account/orders" className={styles.viewAllButton}>
          Xem tất cả
          <ChevronRight size={18} />
        </Link>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Đang tải...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <Package size={48} className={styles.emptyIcon} />
          <p>Chưa có đơn hàng nào</p>
          <Link href="/products" className={styles.shopButton}>
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => {
            const config = statusConfig[order.status] || {
              label: order.status,
              color: "#6b7280",
            };
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className={styles.orderCard}
              >
                <div className={styles.orderInfo}>
                  <span className={styles.orderCode}>#{order.code}</span>
                  <span
                    className={styles.orderStatus}
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className={styles.orderTotal}>
                    {order.total.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <ChevronRight size={20} className={styles.chevron} />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
