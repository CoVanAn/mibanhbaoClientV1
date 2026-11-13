"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMyOrders } from "@/src/queries/useOrder";
import useStore, { UserSlice } from "@/src/store/user";
import { Package, ChevronRight } from "lucide-react";
import {
  orderStatusConfig,
  FILTER_OPTIONS,
  type OrderStatus,
  type StatusFilter,
} from "./statusConfig";
import styles from "./page.module.scss";

type OrdersListViewProps = {
  statusFilter: StatusFilter;
};

export default function OrdersListView({ statusFilter }: OrdersListViewProps) {
  const token = useStore((state: UserSlice) => state.token);
  const isInitialized = useStore((state: UserSlice) => state.isInitialized);

  // Initialize status:
  // 1. Check URL pathname matching FILTER_OPTIONS (e.g. /account/orders/canceled)
  // 2. Check if an explicit statusFilter was given (e.g. from subroute)
  // 3. If "ALL", check sessionStorage for the last active status when returning
  const [currentStatus, setCurrentStatus] = useState<StatusFilter>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathMatched = FILTER_OPTIONS.find((opt) => opt.href === path);
      if (pathMatched) return pathMatched.value;

      if (statusFilter === "ALL") {
        const saved = sessionStorage.getItem(
          "account_orders_status",
        ) as StatusFilter | null;
        const validSaved = FILTER_OPTIONS.find((opt) => opt.value === saved);
        if (validSaved) return validSaved.value;
      }
    }
    return statusFilter;
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Synchronize state when the statusFilter prop changes explicitly
  useEffect(() => {
    if (statusFilter !== "ALL") {
      setCurrentStatus(statusFilter);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("account_orders_status", statusFilter);
      }
      setCurrentPage(1);
    }
  }, [statusFilter]);

  // Persist current status to sessionStorage and keep URL synchronized
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("account_orders_status", currentStatus);
      const matched = FILTER_OPTIONS.find((opt) => opt.value === currentStatus);
      if (
        matched &&
        window.location.pathname !== matched.href &&
        window.location.pathname.startsWith("/account/orders")
      ) {
        window.history.replaceState(null, "", matched.href);
      }
    }
  }, [currentStatus]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const matched = FILTER_OPTIONS.find((opt) => opt.href === path);
      if (matched) {
        setCurrentStatus(matched.value);
        sessionStorage.setItem("account_orders_status", matched.value);
      } else if (path === "/account/orders") {
        const saved = sessionStorage.getItem(
          "account_orders_status",
        ) as StatusFilter | null;
        const validSaved = FILTER_OPTIONS.find((opt) => opt.value === saved);
        if (validSaved) {
          setCurrentStatus(validSaved.value);
        } else {
          setCurrentStatus("ALL");
        }
      }
      setCurrentPage(1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    option: (typeof FILTER_OPTIONS)[0],
  ) => {
    // Prevent full page navigation/unmount so filterBar remains static without reloading
    e.preventDefault();
    if (currentStatus === option.value) return;
    setCurrentStatus(option.value);
    setCurrentPage(1);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("account_orders_status", option.value);
      window.history.pushState(null, "", option.href);
    }
  };

  const { data, isLoading, error } = useMyOrders(
    {
      page: currentPage,
      limit: 10,
      status: currentStatus === "ALL" ? undefined : currentStatus,
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

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className={styles.ordersPage}>
      <div className={styles.ordersWrapper}>
        {/* Status filter bar stays fixed in place without reloading */}
        <div className={styles.filterBar}>
          {FILTER_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={option.href}
              onClick={(e) => handleTabClick(e, option)}
              className={`${styles.filterSelect} ${
                currentStatus === option.value ? styles.filterSelectActive : ""
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        {/* Content area: only the orders list area loads */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <h2>Có lỗi xảy ra</h2>
            <p>Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={64} className={styles.emptyIcon} />
            <h2>Chưa có đơn hàng</h2>
            <br />
            <p>
              {currentStatus === "ALL"
                ? "Bạn chưa có đơn hàng nào."
                : "Không có đơn hàng nào với trạng thái này."}
            </p>
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
                    href={`/account/orders/${order.id}?from=${currentStatus}`}
                    className={styles.orderCard}
                  >
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <span className={styles.orderCode}>#{order.code}</span>
                        <span
                          className={styles.orderStatus}
                          style={{
                            color: config?.color || "#6b7280",
                            backgroundColor: config?.bgColor || "#f3f4f6",
                          }}
                        >
                          {config?.label || order.status}
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
