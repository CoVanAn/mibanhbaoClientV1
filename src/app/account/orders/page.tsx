"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyOrders } from "@/src/queries/useOrder";
import useStore from "@/src/store/user";
import { Package, ChevronRight, Filter } from "lucide-react";
import { orderStatusConfig, type OrderStatus } from "./statusConfig";
import styles from "./page.module.scss";

export default function OrdersPage() {
  const token = useStore((state: any) => state.token);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useMyOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

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
        {/* Filter */}
        <div className={styles.filterBar}>
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | "ALL");
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
          >
            <option value="ALL">Tất cả đơn hàng</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PREPARING">Đang chuẩn bị</option>
            <option value="READY">Sẵn sàng</option>
            <option value="OUT_FOR_DELIVERY">Đang giao</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="CANCELED">Đã hủy</option>
          </select>
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
                              <img
                                src={item.image}
                                alt={item.name}
                                className={styles.itemImage}
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

            {/* Pagination */}
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
