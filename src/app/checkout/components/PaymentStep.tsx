"use client";

import { Banknote, CreditCard, Wallet } from "lucide-react";
import type { CheckoutData, PaymentMethod } from "../types";
import styles from "./PaymentStep.module.scss";

type PaymentOption = {
  id: PaymentMethod | "CREDIT_CARD";
  name: string;
  description: string;
  icon: typeof Banknote;
  available: boolean;
};

interface PaymentStepProps {
  data: CheckoutData;
  onChange: (data: CheckoutData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({
  data,
  onChange,
  onNext,
  onBack,
}: PaymentStepProps) {
  const paymentMethods: PaymentOption[] = [
    {
      id: "COD",
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt hoặc quẹt thẻ khi nhận hàng",
      icon: Banknote,
      available: true,
    },
    {
      id: "BANKING",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua QR Code hoặc số tài khoản",
      icon: Wallet,
      available: false, // Coming soon
    },
    {
      id: "CREDIT_CARD",
      name: "Thẻ tín dụng/Ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      available: false, // Coming soon
    },
  ];

  return (
    <div className={styles.paymentStep}>
      <h2>Phương thức thanh toán</h2>

      <div className={styles.paymentMethods}>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`${styles.paymentMethod} ${
              data.paymentMethod === method.id ? styles.selected : ""
            } ${!method.available ? styles.disabled : ""}`}
            onClick={() => {
              if (
                method.available &&
                (method.id === "COD" || method.id === "BANKING")
              ) {
                onChange({ ...data, paymentMethod: method.id });
              }
            }}
            disabled={!method.available}
          >
            <div className={styles.methodIcon}>
              <method.icon size={28} />
            </div>
            <div className={styles.methodInfo}>
              <strong>{method.name}</strong>
              <p>{method.description}</p>
              {!method.available && (
                <span className={styles.comingSoon}>Sắp ra mắt</span>
              )}
            </div>
            {data.paymentMethod === method.id && method.available && (
              <div className={styles.selectedCheck}>✓</div>
            )}
          </button>
        ))}
      </div>

      {/* COD Info */}
      {data.paymentMethod === "COD" && (
        <div className={styles.paymentInfo}>
          <h3>📦 Thanh toán khi nhận hàng</h3>
          <ul>
            <li>Vui lòng kiểm tra hàng trước khi thanh toán</li>
            <li>Chấp nhận thanh toán bằng tiền mặt</li>
            <li>
              Có thể thanh toán bằng thẻ (tùy phương thức giao hàng/nhận hàng)
            </li>
            <li>Vui lòng chuẩn bị đủ tiền để thanh toán</li>
          </ul>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          Quay lại
        </button>
        <button type="button" className={styles.nextButton} onClick={onNext}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
