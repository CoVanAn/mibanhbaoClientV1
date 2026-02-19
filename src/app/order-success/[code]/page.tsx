"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import styles from "./OrderSuccess.module.scss";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderCode = params.code as string;

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        {/* Success Icon */}
        <div className={styles.successIcon}>
          <CheckCircle size={80} />
        </div>

        {/* Success Message */}
        <h1 className={styles.title}>Đặt hàng thành công!</h1>
        <p className={styles.subtitle}>
          Cảm ơn bạn đã đặt hàng tại Mì Bánh Bao
        </p>

        {/* Order Code */}
        <div className={styles.orderCodeCard}>
          <span className={styles.label}>Mã đơn hàng</span>
          <span className={styles.code}>{orderCode}</span>
        </div>

        {/* Info Cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <Package size={32} />
            <h3 className={styles.cardTitle}>Đơn hàng đang xử lý</h3>
            <p className={styles.cardDesc}>
              Chúng tôi sẽ xác nhận đơn hàng của bạn trong thời gian sớm nhất
            </p>
          </div>

          <div className={styles.infoCard}>
            <MapPin size={32} />
            <h3 className={styles.cardTitle}>Theo dõi đơn hàng</h3>
            <p className={styles.cardDesc}>
              Bạn có thể theo dõi tình trạng đơn hàng trong trang Tài khoản
            </p>
          </div>

          <div className={styles.infoCard}>
            <CreditCard size={32} />
            <h3 className={styles.cardTitle}>Thanh toán khi nhận hàng</h3>
            <p className={styles.cardDesc}>
              Vui lòng chuẩn bị đủ tiền khi shipper đến giao hàng
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className={styles.notes}>
          <h3 className={styles.notesTitle}>📝 Lưu ý quan trọng</h3>
          <ul className={styles.notesList}>
            <li>
              Vui lòng giữ điện thoại để shipper có thể liên hệ khi giao hàng
            </li>
            <li>Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
            <li>
              Nếu có vấn đề với đơn hàng, vui lòng liên hệ hotline:{" "}
              <strong>0123-456-789</strong>
            </li>
            <li>
              Bạn có thể hủy đơn hàng trong vòng 30 phút sau khi đặt (nếu đơn
              hàng chưa được xác nhận)
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href="/account/orders" className={styles.primaryButton}>
            <Package size={20} />
            Xem đơn hàng của tôi
            <ArrowRight size={20} />
          </Link>
          <Link href="/products" className={styles.secondaryButton}>
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Download Receipt (Optional) */}
        <div className={styles.receipt}>
          <p className={styles.receiptText}>
            Biên lai đơn hàng đã được gửi đến email của bạn
            <br />
            <button
              type="button"
              className={styles.downloadLink}
              onClick={() => {
                // TODO: Implement download receipt
                alert(
                  "Chức năng tải xuống biên lai đang trong quá trình phát triển",
                );
              }}
            >
              Tải xuống biên lai PDF
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
