"use client";

import { MapPin, CreditCard, ShoppingBag, AlertCircle } from "lucide-react";
import Image from "next/image";
import type { Cart } from "@/src/apiRequests/cart";
import type { Address } from "@/src/app/account/types";
import styles from "./ReviewStep.module.scss";

interface ReviewStepProps {
  data: {
    method: "DELIVERY" | "PICKUP";
    addressId?: number;
    customerNote: string;
    paymentMethod: "COD" | "BANKING";
    scheduledAt?: string;
  };
  cart: Cart;
  onBack: () => void;
  onPlaceOrder: () => void;
  isLoading: boolean;
  addresses: Address[];
}

export default function ReviewStep({
  data,
  cart,
  onBack,
  onPlaceOrder,
  isLoading,
  addresses,
}: ReviewStepProps) {
  const selectedAddress = addresses.find((a) => a.id === data.addressId);

  const shippingFee = data.method === "DELIVERY" ? 30000 : 0;
  const discount = cart.coupon
    ? cart.coupon.type === "PERCENT"
      ? Math.floor((cart.subtotal * cart.coupon.value) / 100)
      : Math.min(cart.coupon.value, cart.subtotal)
    : 0;
  const total = cart.subtotal + shippingFee - discount;

  return (
    <div className={styles.reviewStep}>
      <h2>Xác nhận đơn hàng</h2>

      {/* Shipping Info */}
      <div className={styles.section}>
        <h3>
          <MapPin size={20} />
          {data.method === "DELIVERY"
            ? "Địa chỉ giao hàng"
            : "Nhận tại cửa hàng"}
        </h3>
        <div className={styles.infoCard}>
          {data.method === "DELIVERY" && selectedAddress ? (
            <>
              <div className={styles.addressHeader}>
                <strong>{selectedAddress.name}</strong>
                <span>{selectedAddress.phone}</span>
              </div>
              <p>
                {selectedAddress.addressLine}, {selectedAddress.ward},{" "}
                {selectedAddress.district}, {selectedAddress.province}
              </p>
              {selectedAddress.company && (
                <p className={styles.companyName}>{selectedAddress.company}</p>
              )}
            </>
          ) : data.method === "DELIVERY" ? (
            <p className={styles.errorText}>Không tìm thấy địa chỉ</p>
          ) : (
            <>
              <strong>Cửa hàng Mì Bánh Bao</strong>
              <p>123 Lê Văn Sỹ, Phường 13, Quận 3, TP. Hồ Chí Minh</p>
              {data.scheduledAt && (
                <p className={styles.scheduledTime}>
                  <strong>Thời gian nhận:</strong>{" "}
                  {new Date(data.scheduledAt).toLocaleString("vi-VN")}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className={styles.section}>
        <h3>
          <CreditCard size={20} />
          Phương thức thanh toán
        </h3>
        <div className={styles.infoCard}>
          <strong>
            {data.paymentMethod === "COD"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Chuyển khoản ngân hàng"}
          </strong>
          <p>
            {data.paymentMethod === "COD"
              ? "Thanh toán bằng tiền mặt hoặc quẹt thẻ khi nhận hàng"
              : "Chuyển khoản qua QR Code hoặc số tài khoản"}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className={styles.section}>
        <h3>
          <ShoppingBag size={20} />
          Sản phẩm ({cart.totalItems} món)
        </h3>
        <div className={styles.itemsList}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              {item.productImage && (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  className={styles.itemImage}
                  width={80}
                  height={80}
                  unoptimized
                />
              )}
              <div className={styles.itemDetails}>
                <strong>{item.productName}</strong>
                <span className={styles.variantName}>{item.variantName}</span>
                <span className={styles.itemQty}>
                  Số lượng: {item.quantity}
                </span>
              </div>
              <div className={styles.itemPrice}>
                {item.subtotal.toLocaleString("vi-VN")} ₫
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Note */}
      {data.customerNote && (
        <div className={styles.section}>
          <h3>💬 Ghi chú</h3>
          <div className={styles.infoCard}>
            <p>{data.customerNote}</p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className={styles.orderSummary}>
        <div className={styles.summaryRow}>
          <span>Tạm tính:</span>
          <span>{cart.subtotal.toLocaleString("vi-VN")} ₫</span>
        </div>

        {shippingFee > 0 && (
          <div className={styles.summaryRow}>
            <span>Phí vận chuyển:</span>
            <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
          </div>
        )}

        {discount > 0 && (
          <div className={styles.summaryRow}>
            <span>Giảm giá ({cart.coupon?.code}):</span>
            <span className={styles.discount}>
              -{discount.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        )}

        <div className={styles.summaryTotal}>
          <span>Tổng cộng:</span>
          <span className={styles.totalAmount}>
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>

      {/* Warning */}
      <div className={styles.warning}>
        <AlertCircle size={20} />
        <p>
          Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi xác nhận. Đơn hàng
          sau khi đặt sẽ không thể chỉnh sửa.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          disabled={isLoading}
        >
          Quay lại
        </button>
        <button
          type="button"
          className={styles.placeOrderButton}
          onClick={onPlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}
