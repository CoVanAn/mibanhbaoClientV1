"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMyOrders } from "@/src/queries/useOrder";
import useStore, { UserSlice } from "@/src/store/user";
import { Package, ChevronRight } from "lucide-react";
import { orderStatusConfig, type OrderStatus } from "./statusConfig";
import styles from "./page.module.scss";

type StatusFilter = OrderStatus | "ALL";

type OrdersListViewProps = {
  statusFilter: StatusFilter;
};

const FILTER_OPTIONS: Array<{
  label: string;
  value: StatusFilter;
  href: string;
}> = [
  { label: "Tất cả", value: "ALL", href: "/account/orders/all" },
  { label: "Xác nhận", value: "CONFIRMED", href: "/account/orders/confirmed" },
  {
    label: "Đang giao",
    value: "OUT_FOR_DELIVERY",
    href: "/account/orders/out-for-delivery",
  },
  {
    label: "Đã hoàn thành",
    value: "COMPLETED",
    href: "/account/orders/completed",
  },
  { label: "Đã hủy", value: "CANCELED", href: "/account/orders/canceled" },
];

export default function OrdersListView({ statusFilter }: OrdersListViewProps) {
  const token = useStore((state: UserSlice) => state.token);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useMyOrders(
    {
      page: currentPage,
      limit: 10,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    },
    isInitialized && !!token,
  );

  if (!isInitialized) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.ordersWrapper}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang xác thực phiên đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.ordersWrapper}>
          <div className={styles.emptyState}>
            <Package size={64} className={styles.emptyIcon} />
            <h2>Đăng nhập để xem đơn hàng</h2>
            <p>Hãy đăng nhập để xem lịch sử đơn hàng của bạn.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.ordersWrapper}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.ordersPage}>
        <div className={styles.ordersWrapper}>
          <div className={styles.errorState}>
            <h2>Có lỗi xảy ra</h2>
            <p>Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className={styles.ordersPage}>
      <div className={styles.ordersWrapper}>
        <div className={styles.filterBar}>
          {FILTER_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={option.href}
              className={`${styles.filterSelect} ${statusFilter === option.value ? styles.filterSelectActive : ""}`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={64} className={styles.emptyIcon} />
            <h2>Chưa có đơn hàng</h2>
            <p>
              {statusFilter === "ALL"
                ? "Bạn chưa có đơn hàng nào."
                : "Không có đơn hàng nào với trạng thái này."}
            </p>
            <Link href="/products" className={styles.shopButton}>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.ordersList}>
              {orders.map((order) => {
                const config = orderStatusConfig[order.status as OrderStatus];
                const totalItems = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );

                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className={styles.orderCard}
                  >
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <span className={styles.orderCode}>#{order.code}</span>
                        <span
                          className={styles.orderStatus}
                          style={{
                            color: config.color,
                            backgroundColor: config.bgColor,
                          }}
                        >
                          {config.label}
                        </span>
                      </div>
                      <ChevronRight size={20} className={styles.chevron} />
                    </div>

                    <div className={styles.orderContent}>
                      <div className={styles.orderItems}>
                        {order.items.slice(0, 4).map((item) => (
                          <div key={item.id} className={styles.orderItem}>
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                className={styles.itemImage}
                                width={80}
                                height={80}
                                unoptimized
                              />
                            )}
                            <div className={styles.itemInfo}>
                              <span className={styles.itemName}>
                                {item.name}
                              </span>
                              {item.variant && (
                                <span className={styles.itemVariant}>
                                  {item.variant}
                                </span>
                              )}
                              <span className={styles.itemQuantity}>
                                x{item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <span className={styles.moreItems}>
                            +{order.items.length - 4} sản phẩm khác
                          </span>
                        )}
                      </div>

                      <div className={styles.orderMeta}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Tổng tiền:</span>
                          <span className={styles.metaValue}>
                            {order.total.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Số lượng:</span>
                          <span className={styles.metaValue}>
                            {totalItems} sản phẩm
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Ngày đặt:</span>
                          <span className={styles.metaValue}>
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={styles.pageButton}
                >
                  Trước
                </button>
                <span className={styles.pageInfo}>
                  Trang {currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(pagination.totalPages, p + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className={styles.pageButton}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
