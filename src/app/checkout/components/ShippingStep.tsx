"use client";

import { useEffect, useRef } from "react";
import { MapPin, Plus, Home, Building } from "lucide-react";
import Link from "next/link";
import type { Address } from "@/src/app/account/types";
import styles from "./ShippingStep.module.scss";

interface ShippingStepProps {
  data: {
    method: "DELIVERY" | "PICKUP";
    addressId?: number;
    scheduledAt?: string;
    customerNote: string;
  };
  onChange: (data: any) => void;
  onNext: () => void;
  addresses: Address[];
}

export default function ShippingStep({
  data,
  onChange,
  onNext,
  addresses,
}: ShippingStepProps) {
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    // Auto-select first address only once when addresses load
    if (
      !hasAutoSelected.current &&
      data.method === "DELIVERY" &&
      !data.addressId &&
      addresses.length > 0
    ) {
      hasAutoSelected.current = true;
      onChange({ ...data, addressId: addresses[0].id });
    }
  }, [addresses]);

  const handleMethodChange = (method: "DELIVERY" | "PICKUP") => {
    if (method === data.method) return;

    const newData = {
      ...data,
      method,
      addressId:
        method === "PICKUP"
          ? undefined
          : method === "DELIVERY" && addresses.length > 0 && !data.addressId
            ? addresses[0].id
            : data.addressId,
    };
    onChange(newData);
  };

  const handleAddressSelect = (addressId: number) => {
    onChange({ ...data, addressId });
  };

  return (
    <div className={styles.shippingStep}>
      <h2>Phương thức nhận hàng</h2>

      {/* Method Selection */}
      <div className={styles.methodOptions}>
        <button
          type="button"
          className={`${styles.methodOption} ${
            data.method === "DELIVERY" ? styles.selected : ""
          }`}
          onClick={() => handleMethodChange("DELIVERY")}
        >
          <Home size={24} />
          <div>
            <strong>Giao hàng tận nơi</strong>
            <span>Phí vận chuyển: 30,000 ₫</span>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.methodOption} ${
            data.method === "PICKUP" ? styles.selected : ""
          }`}
          onClick={() => handleMethodChange("PICKUP")}
        >
          <Building size={24} />
          <div>
            <strong>Nhận tại cửa hàng</strong>
            <span>Miễn phí vận chuyển</span>
          </div>
        </button>
      </div>

      {/* Delivery Address Selection */}
      {data.method === "DELIVERY" && (
        <div className={styles.addressSection}>
          <div className={styles.sectionHeader}>
            <h3>
              <MapPin size={20} />
              Địa chỉ giao hàng
            </h3>
            <Link href="/account/address" className={styles.addButton}>
              <Plus size={18} />
              Thêm địa chỉ mới
            </Link>
          </div>

          <div className={styles.addressList}>
            {addresses.length === 0 ? (
              <div className={styles.emptyAddresses}>
                <p>Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`${styles.addressCard} ${
                    data.addressId === address.id ? styles.selected : ""
                  }`}
                  onClick={() => handleAddressSelect(address.id)}
                >
                  <div className={styles.addressInfo}>
                    <strong>{address.name}</strong>
                    <span>{address.phone}</span>
                  </div>
                  <p className={styles.addressText}>
                    {address.addressLine}, {address.ward}, {address.district},{" "}
                    {address.province}
                  </p>
                  {address.company && (
                    <p className={styles.addressCompany}>{address.company}</p>
                  )}
                  {data.addressId === address.id && (
                    <div className={styles.selectedCheck}>✓</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Pickup Location */}
      {data.method === "PICKUP" && (
        <div className={styles.pickupSection}>
          <h3>
            <Building size={20} />
            Địa điểm nhận hàng
          </h3>
          <div className={styles.pickupCard}>
            <strong>Cửa hàng Mì Bánh Bao</strong>
            <p>123 Lê Văn Sỹ, Phường 13, Quận 3, TP. Hồ Chí Minh</p>
            <p className={styles.pickupHours}>
              <strong>Giờ mở cửa:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)
            </p>
          </div>

          <div className={styles.formGroup}>
            <label>Thời gian dự kiến nhận hàng (tùy chọn)</label>
            <input
              type="datetime-local"
              value={data.scheduledAt || ""}
              onChange={(e) =>
                onChange({ ...data, scheduledAt: e.target.value || undefined })
              }
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>
      )}

      {/* Customer Note */}
      <div className={styles.noteSection}>
        <label>Ghi chú đơn hàng (tùy chọn)</label>
        <textarea
          value={data.customerNote}
          onChange={(e) => onChange({ ...data, customerNote: e.target.value })}
          placeholder="Ghi chú cho người bán..."
          rows={4}
        />
      </div>

      {/* Next Button */}
      <button
        type="button"
        className={styles.nextButton}
        onClick={onNext}
        disabled={data.method === "DELIVERY" && !data.addressId}
      >
        Tiếp tục
      </button>
    </div>
  );
}
