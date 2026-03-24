export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "COMPLETED"
    | "CANCELED"
    | "REFUNDED";

export const orderStatusConfig: Record<
    OrderStatus,
    { label: string; color: string; bgColor: string }
> = {
    PENDING: { label: "Chờ xác nhận", color: "#f59e0b", bgColor: "#fef3c7" },
    CONFIRMED: { label: "Đã xác nhận", color: "#3b82f6", bgColor: "#dbeafe" },
    PREPARING: { label: "Đang chuẩn bị", color: "#8b5cf6", bgColor: "#ede9fe" },
    READY: { label: "Sẵn sàng", color: "#06b6d4", bgColor: "#cffafe" },
    OUT_FOR_DELIVERY: {
        label: "Đang giao",
        color: "#0891b2",
        bgColor: "#cffafe",
    },
    COMPLETED: { label: "Đã hoàn thành", color: "#10b981", bgColor: "#d1fae5" },
    CANCELED: { label: "Đã hủy", color: "#ef4444", bgColor: "#fee2e2" },
    REFUNDED: { label: "Đã hoàn tiền", color: "#6b7280", bgColor: "#f3f4f6" },
};