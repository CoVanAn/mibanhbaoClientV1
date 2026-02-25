"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrder, useCancelOrder } from "@/src/queries/useOrder";
import useStore from "@/src/store/useStore";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  House,
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.scss";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELED"
  | "REFUNDED";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "#3b82f6",
    bgColor: "#dbeafe",
    icon: CheckCircle,
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
    icon: Package,
  },
  READY: {
    label: "Sẵn sàng",
    color: "#06b6d4",
    bgColor: "#cffafe",
    icon: CheckCircle,
  },
  OUT_FOR_DELIVERY: {
    label: "Đang giao",
    color: "#0891b2",
    bgColor: "#cffafe",
    icon: Package,
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    color: "#10b981",
    bgColor: "#d1fae5",
    icon: CheckCircle,
  },
  CANCELED: {
    label: "Đã hủy",
    color: "#ef4444",
    bgColor: "#fee2e2",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    color: "#6b7280",
    bgColor: "#f3f4f6",
    icon: AlertCircle,
  },
};

const paymentStatusConfig = {
  UNPAID: { label: "Chưa thanh toán", color: "#f59e0b" },
  AUTHORIZED: { label: "Đã ủy quyền", color: "#3b82f6" },
  PAID: { label: "Đã thanh toán", color: "#10b981" },
  FAILED: { label: "Thất bại", color: "#ef4444" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#6b7280" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useStore((state: any) => state.token);
  const orderId = Number(params.id);

  const { data: order, isLoading, error } = useOrder(orderId);
  const cancelOrder = useCancelOrder();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  if (!token) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.detailWrapper}>
          <div className={styles.emptyState}>
            <Package size={64} />
            <h2>Đăng nhập để xem đơn hàng</h2>
            <Link href="/account" className={styles.backButton}>
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.detailWrapper}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.detailWrapper}>
          <div className={styles.errorState}>
            <h2>Không tìm thấy đơn hàng</h2>
            <p>Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.</p>
            <Link href="/account/orders" className={styles.backButton}>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const config = statusConfig[order.status as OrderStatus];
  const StatusIcon = config.icon;

  // Check if order can be cancelled
  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status);

  // Check if order is completed (delivered + paid)
  const isCompleted =
    order.status === "COMPLETED" &&
    order.payments?.some((p) => p.status === "PAID");

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn");
      return;
    }

    setIsCancelling(true);
    try {
      await cancelOrder.mutateAsync({
        orderId: order.id,
        payload: { reason: cancelReason },
      });
      alert("Đã hủy đơn hàng thành công");
      setShowCancelModal(false);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          <div className={styles.headerInfo}>
            <h1>Chi tiết đơn hàng</h1>
            <span className={styles.orderCode}>#{order.code}</span>
          </div>
        </div>

        {/* Status Card */}
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <div
              className={styles.statusBadge}
              style={{
                color: config.color,
                backgroundColor: config.bgColor,
              }}
            >
              <StatusIcon size={20} />
              <span>{config.label}</span>
            </div>
            <span className={styles.orderDate}>
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>

          {order.customerNote && (
            <div className={styles.customerNote}>
              <strong>Ghi chú:</strong> {order.customerNote}
            </div>
          )}
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Items */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Package size={20} />
                Sản phẩm đã đặt
              </h2>
              <div className={styles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                    )}
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      {item.variant && (
                        <p className={styles.itemVariant}>{item.variant}</p>
                      )}
                      {item.sku && (
                        <p className={styles.itemSku}>SKU: {item.sku}</p>
                      )}
                      <div className={styles.itemPricing}>
                        <span className={styles.itemQuantity}>
                          x{item.quantity}
                        </span>
                        <span className={styles.itemPrice}>
                          {item.unitPrice.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemTotal}>
                      {item.lineTotal.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Tạm tính:</span>
                  <span>{order.itemsSubtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingFee.toLocaleString("vi-VN")} ₫</span>
                </div>
                {order.discount > 0 && (
                  <div className={styles.totalRow}>
                    <span>Giảm giá:</span>
                    <span style={{ color: "#ef4444" }}>
                      -{order.discount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                )}
                <div className={styles.totalRowFinal}>
                  <span>Tổng cộng:</span>
                  <span className={styles.finalAmount}>
                    {order.total.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            {/* {order.statusHistory && order.statusHistory.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Clock size={20} />
                  Lịch sử đơn hàng
                </h2>
                <div className={styles.timeline}>
                  {order.statusHistory.map((history, index) => (
                    <div key={history.id} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      {index < order.statusHistory.length - 1 && (
                        <div className={styles.timelineLine} />
                      )}
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineStatus}>
                          {statusConfig[history.toStatus as OrderStatus]
                            ?.label || history.toStatus}
                        </div>
                        <div className={styles.timelineDate}>
                          {new Date(history.createdAt).toLocaleString("vi-VN")}
                        </div>
                        {history.reason && (
                          <div className={styles.timelineReason}>
                            {history.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <MapPin size={20} />
                {order.method === "DELIVERY"
                  ? "Địa chỉ giao hàng"
                  : "Thông tin nhận hàng"}
              </h2>
              {order.method === "DELIVERY" && order.address ? (
                <div className={styles.addressInfo}>
                  <p className={styles.addressName}>{order.address.name}</p>
                  <p className={styles.addressPhone}>{order.address.phone}</p>
                  <p className={styles.addressLine}>
                    {order.address.addressLine}
                  </p>
                  <p className={styles.addressLocation}>
                    {order.address.ward}, {order.address.district},{" "}
                    {order.address.province}
                  </p>
                </div>
              ) : (
                <div className={styles.pickupInfo}>
                  <strong>Nhận tại cửa hàng</strong>
                  {order.pickupAt && (
                    <p className={styles.pickupTime}>
                      Thời gian:{" "}
                      {new Date(order.pickupAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* {order.payments && order.payments.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <CreditCard size={20} />
                  Thanh toán
                </h2>
                <div className={styles.paymentsList}>
                  {order.payments.map((payment) => (
                    <div key={payment.id} className={styles.paymentItem}>
                      <div className={styles.paymentInfo}>
                        <span className={styles.paymentProvider}>
                          {payment.provider}
                        </span>
                        <span
                          className={styles.paymentStatus}
                          style={{
                            color:
                              paymentStatusConfig[
                                payment.status as keyof typeof paymentStatusConfig
                              ]?.color,
                          }}
                        >
                          {
                            paymentStatusConfig[
                              payment.status as keyof typeof paymentStatusConfig
                            ]?.label
                          }
                        </span>
                      </div>
                      <div className={styles.paymentAmount}>
                        {payment.amount.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <MapPin size={20} />
                {order.method === "DELIVERY"
                  ? "Địa chỉ giao hàng"
                  : "Thông tin nhận hàng"}
              </h2>
              {order.method === "DELIVERY" && order.address ? (
                <div className={styles.addressInfo}>
                  <p className={styles.addressName}>{order.address.name}</p>
                  <p className={styles.addressPhone}>{order.address.phone}</p>
                  <p className={styles.addressLine}>
                    {order.address.addressLine}
                  </p>
                  <p className={styles.addressLocation}>
                    {order.address.ward}, {order.address.district},{" "}
                    {order.address.province}
                  </p>
                </div>
              ) : (
                <div className={styles.pickupInfo}>
                  <p>Nhận tại cửa hàng</p>
                  {order.pickupAt && (
                    <p className={styles.pickupTime}>
                      Thời gian:{" "}
                      {new Date(order.pickupAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
              )}
            </div> */}
            {order.payments && order.payments.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <CreditCard size={20} />
                  Thanh toán
                </h2>
                <div className={styles.paymentsList}>
                  {order.payments.map((payment) => (
                    <div key={payment.id} className={styles.paymentItem}>
                      <div className={styles.paymentInfo}>
                        <span className={styles.paymentProvider}>
                          {payment.provider}
                        </span>
                        <span
                          className={styles.paymentStatus}
                          style={{
                            color:
                              paymentStatusConfig[
                                payment.status as keyof typeof paymentStatusConfig
                              ]?.color,
                          }}
                        >
                          {
                            paymentStatusConfig[
                              payment.status as keyof typeof paymentStatusConfig
                            ]?.label
                          }
                        </span>
                      </div>
                      <div className={styles.paymentAmount}>
                        {payment.amount.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Clock size={20} />
                  Lịch sử đơn hàng
                </h2>
                <div className={styles.timeline}>
                  {order.statusHistory.map((history, index) => (
                    <div key={history.id} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      {index < order.statusHistory.length - 1 && (
                        <div className={styles.timelineLine} />
                      )}
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineStatus}>
                          {statusConfig[history.toStatus as OrderStatus]
                            ?.label || history.toStatus}
                        </div>
                        <div className={styles.timelineDate}>
                          {new Date(history.createdAt).toLocaleString("vi-VN")}
                        </div>
                        {history.reason && (
                          <div className={styles.timelineReason}>
                            {history.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {canCancel && !isCompleted && (
              <button
                onClick={() => setShowCancelModal(true)}
                className={styles.cancelButton}
              >
                <XCircle size={20} />
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className={styles.modal} onClick={() => setShowCancelModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Hủy đơn hàng</h2>
            <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
            <textarea
              placeholder="Nhập lý do hủy đơn (bắt buộc)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className={styles.cancelTextarea}
              rows={4}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowCancelModal(false)}
                className={styles.modalBtnSecondary}
                disabled={isCancelling}
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                className={styles.modalBtnDanger}
                disabled={isCancelling}
              >
                {isCancelling ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
