"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCart,
  useApplyCoupon,
  useRemoveCoupon,
} from "@/src/queries/useCart";
import { useCreateOrder } from "@/src/queries/useOrder";
import { useProfile, useAddresses } from "@/src/queries/useAccount";
import { useToast } from "@/src/components/common/toast";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import ShippingStep from "./components/ShippingStep";
import PaymentStep from "./components/PaymentStep";
import ReviewStep from "./components/ReviewStep";
import type { CheckoutData } from "./types";
import { getApiErrorMessage } from "@/src/lib/error";
import styles from "./Checkout.module.scss";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useProfile();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const createOrder = useCreateOrder();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    method: "DELIVERY",
    addressId: undefined,
    customerNote: "",
    pickupAt: undefined,
    scheduledAt: undefined,
    paymentMethod: "COD",
  });

  // Redirect if not logged in
  if (!userLoading && !user) {
    router.push("/account/login?redirect=/checkout");
    return null;
  }

  // Redirect if cart is empty
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    console.log("Cart check - redirecting to /cart");
    console.log("Cart data:", cart);
    router.push("/cart");
    return null;
  }

  if (cartLoading || userLoading || addressesLoading) {
    return (
      <div className={styles.loading}>
        <h2>Đang tải...</h2>
      </div>
    );
  }

  console.log("=== CHECKOUT PAGE STATE ===");
  console.log("Cart:", cart);
  console.log("Cart items count:", cart?.items?.length);
  console.log("User:", user);
  console.log("Addresses:", addresses);

  const steps = [
    { id: "shipping", label: "Giao hàng", icon: MapPin },
    { id: "payment", label: "Thanh toán", icon: CreditCard },
    { id: "review", label: "Xác nhận", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    if (currentStep === "shipping") {
      // Validate shipping info
      if (checkoutData.method === "DELIVERY" && !checkoutData.addressId) {
        toast.error("Vui lòng chọn địa chỉ giao hàng");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      setCurrentStep("review");
    }
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    try {
      await applyCoupon.mutateAsync(couponCode.trim().toUpperCase());
      setCouponCode("");
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "Mã giảm giá không hợp lệ");
      setCouponError(msg);
      toast.error(msg);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon.mutateAsync();
      toast.success("Đã xóa mã giảm giá");
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Không thể xóa mã giảm giá");
      toast.error(message);
    }
  };

  const couponDiscount = cart?.coupon
    ? cart.coupon.type === "PERCENT"
      ? Math.floor((cart.subtotal * cart.coupon.value) / 100)
      : Math.min(cart.coupon.value, cart.subtotal)
    : 0;

  const handlePlaceOrder = async () => {
    try {
      // Validate required fields before sending
      if (checkoutData.method === "DELIVERY" && !checkoutData.addressId) {
        toast.error("Vui lòng chọn địa chỉ giao hàng");
        return;
      }

      // Check authentication status
      console.log("User data:", user);
      console.log("User ID:", user?.id);

      // Log the payload for debugging
      console.log("Creating order with payload:", {
        method: checkoutData.method,
        addressId: checkoutData.addressId,
        customerNote: checkoutData.customerNote || undefined,
        pickupAt: checkoutData.pickupAt,
        scheduledAt: checkoutData.scheduledAt,
      });

      await createOrder.mutateAsync({
        method: checkoutData.method,
        addressId: checkoutData.addressId,
        customerNote: checkoutData.customerNote || undefined,
        pickupAt: checkoutData.pickupAt,
        scheduledAt: checkoutData.scheduledAt,
      });
      // Redirect is handled in mutation onSuccess
    } catch (error: unknown) {
      console.error("Order creation error:", error);
      const errorMsg = getApiErrorMessage(error, "Không thể tạo đơn hàng");
      toast.error(errorMsg);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Thanh toán</h1>
          <Link href="/cart" className={styles.backToCart}>
            <ShoppingCart size={20} />
            Quay lại giỏ hàng
          </Link>
        </div>

        {/* Steps Progress */}
        <div className={styles.stepsProgress}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div
                key={step.id}
                className={`${styles.step} ${isActive ? styles.active : ""} ${
                  isCompleted ? styles.completed : ""
                }`}
              >
                <div className={styles.stepIcon}>
                  <Icon size={24} />
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
                {index < steps.length - 1 && (
                  <div className={styles.stepLine}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className={styles.content}>
          <div className={styles.main}>
            {currentStep === "shipping" && (
              <ShippingStep
                data={checkoutData}
                onChange={setCheckoutData}
                onNext={handleNext}
                addresses={addresses}
              />
            )}

            {currentStep === "payment" && (
              <PaymentStep
                data={checkoutData}
                onChange={setCheckoutData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === "review" && (
              <ReviewStep
                data={checkoutData}
                cart={cart!}
                onBack={handleBack}
                onPlaceOrder={handlePlaceOrder}
                isLoading={createOrder.isPending}
                addresses={addresses}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h3>Tóm tắt đơn hàng</h3>

              <div className={styles.summaryItems}>
                <div className={styles.itemCount}>
                  {cart?.totalItems} sản phẩm
                </div>
                {cart?.items.slice(0, 3).map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <span className={styles.itemName}>
                      {item.productName} - {item.variantName}
                    </span>
                    <span className={styles.itemQty}>x{item.quantity}</span>
                  </div>
                ))}
                {cart && cart.items.length > 3 && (
                  <div className={styles.moreItems}>
                    +{cart.items.length - 3} sản phẩm khác
                  </div>
                )}
              </div>

              {/* Coupon box */}
              {!cart?.coupon ? (
                <div className={styles.couponBox}>
                  <div className={styles.couponRow}>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      placeholder="Mã giảm giá"
                      className={styles.couponInput}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || applyCoupon.isPending}
                      className={styles.couponApplyBtn}
                    >
                      {applyCoupon.isPending ? "..." : "Áp dụng"}
                    </button>
                  </div>
                  {couponError && (
                    <p className={styles.couponError}>{couponError}</p>
                  )}
                </div>
              ) : (
                <div className={styles.couponApplied}>
                  <Tag size={14} />
                  <span className={styles.couponCode}>{cart.coupon.code}</span>
                  <span className={styles.couponSaving}>
                    -{couponDiscount.toLocaleString("vi-VN")} ₫
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className={styles.couponRemoveBtn}
                    title="Xóa mã"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className={styles.summaryDivider} />

              <div className={styles.summaryRow}>
                <span>Tạm tính:</span>
                <span>{cart?.subtotal.toLocaleString("vi-VN")} ₫</span>
              </div>

              {checkoutData.method === "DELIVERY" && (
                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span>30,000 ₫</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Giảm giá:</span>
                  <span className={styles.discount}>
                    -{couponDiscount.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              )}

              <div className={styles.summaryTotal}>
                <span>Tổng cộng:</span>
                <span className={styles.totalAmount}>
                  {(
                    (cart?.subtotal || 0) +
                    (checkoutData.method === "DELIVERY" ? 30000 : 0) -
                    couponDiscount
                  ).toLocaleString("vi-VN")}{" "}
                  ₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
