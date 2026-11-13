"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Trash2 } from "lucide-react";
import styles from "./Toast.module.scss";

export type ToastType = "success" | "error" | "info" | "confirm";

export interface ConfirmToastOptions {
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

export type ToastContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  confirm: (
    options: ConfirmToastOptions | string,
    onConfirmCallback?: () => void | Promise<void>,
  ) => void;
  dismiss: (id?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove regular toasts after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const confirm = useCallback(
    (
      options: ConfirmToastOptions | string,
      onConfirmCallback?: () => void | Promise<void>,
    ) => {
      const id = Date.now();
      let message = "Xóa sản phẩm khỏi giỏ hàng";
      let confirmText = "Xóa";
      let cancelText = "Hủy";
      let onConfirm: (() => void | Promise<void>) | undefined = onConfirmCallback;
      let onCancel: (() => void) | undefined;

      if (typeof options === "string") {
        message = options;
      } else if (options) {
        if (options.message) message = options.message;
        if (options.confirmText) confirmText = options.confirmText;
        if (options.cancelText) cancelText = options.cancelText;
        if (options.onConfirm) onConfirm = options.onConfirm;
        onCancel = options.onCancel;
      }

      if (!onConfirm) {
        throw new Error("onConfirm callback is required for confirm toast");
      }

      setToasts((prev) => {
        // Cancel and remove any prior confirm toasts so only one shows at a time
        const filtered = prev.filter((t) => {
          if (t.type === "confirm") {
            t.onCancel?.();
            return false;
          }
          return true;
        });

        return [
          ...filtered,
          {
            id,
            message,
            type: "confirm",
            confirmText,
            cancelText,
            onConfirm,
            onCancel,
          },
        ];
      });
    },
    [],
  );

  const dismiss = useCallback((id?: number) => {
    if (id !== undefined) {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    } else {
      setToasts([]);
    }
  }, []);

  const handleConfirm = async (toast: Toast) => {
    if (confirmingId === toast.id) return;
    setConfirmingId(toast.id);
    try {
      if (toast.onConfirm) {
        await toast.onConfirm();
      }
    } finally {
      setConfirmingId(null);
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }
  };

  const handleCancel = (toast: Toast) => {
    try {
      toast.onCancel?.();
    } finally {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }
  };

  // Close confirm toast on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setToasts((prev) => {
          const confirms = prev.filter((t) => t.type === "confirm");
          confirms.forEach((t) => t.onCancel?.());
          return prev.filter((t) => t.type !== "confirm");
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock background scroll when confirm modal is visible
  useEffect(() => {
    const hasConfirm = toasts.some((t) => t.type === "confirm");
    if (hasConfirm) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [toasts]);

  const confirmToast = toasts.find((t) => t.type === "confirm");
  const regularToasts = toasts.filter((t) => t.type !== "confirm");

  const toastContextValue: ToastContextType = {
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    info: (message: string) => addToast(message, "info"),
    confirm,
    dismiss,
  };

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}

      {/* Dimmed & blurred backdrop with centered confirm card */}
      {confirmToast && (
        <div
          className={styles.confirmOverlay}
          onClick={() => handleCancel(confirmToast)}
        >
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-label={confirmToast.message}
          >
            <div className={styles.confirmHeader}>
              <div className={styles.confirmIconWrapper}>
                <Trash2 size={20} />
              </div>
              <span className={styles.confirmMessage}>{confirmToast.message}</span>
            </div>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => handleCancel(confirmToast)}
                disabled={confirmingId === confirmToast.id}
              >
                {confirmToast.cancelText || "Hủy"}
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleConfirm(confirmToast)}
                disabled={confirmingId === confirmToast.id}
              >
                {confirmingId === confirmToast.id
                  ? "Đang xóa..."
                  : confirmToast.confirmText || "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regular toast notifications (top-right) */}
      <div className={styles.toastContainer}>
        {regularToasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
