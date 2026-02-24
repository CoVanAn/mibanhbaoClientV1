"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useStore from "@/src/store/useStore";
import { FiX, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import {
  Address,
  AddressForm,
  StatusMessage,
  addressFormSchema,
} from "../types";
import { accountAPI } from "@/src/apiRequests/account";

import styles from "./Address.module.scss";

const initialAddressForm: AddressForm = {
  name: "",
  phone: "",
  company: "",
  addressLine: "",
  province: "",
  district: "",
  ward: "",
};

const getStatusVariantClass = (type?: string) => {
  if (type === "success") return styles.accountStatusSuccess;
  if (type === "error") return styles.accountStatusError;
  return "";
};

const AddressSection = () => {
  const token = useStore((state: any) => state.token);
  const url = useStore((state: any) => state.url);
  const [addressForm, setAddressForm] =
    useState<AddressForm>(initialAddressForm);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressMessage, setAddressMessage] = useState<StatusMessage | null>(
    null,
  );
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAddresses = async () => {
    if (!token) return;
    setAddressesLoading(true);
    try {
      const data = await accountAPI.getAddresses();
      setAddresses(data);
      setAddressMessage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi khi tải địa chỉ";
      setAddressMessage({ type: "error", text: message });
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAddresses();
  }, [token, url]);

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setIsModalOpen(true);
    setAddressMessage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAddressForm(initialAddressForm);
    setEditingAddressId(null);
    setAddressMessage(null);
  };

  const handleAddNewAddress = () => {
    setAddressForm(initialAddressForm);
    setEditingAddressId(null);
    openModal();
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = addressFormSchema.safeParse(addressForm);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Vui lòng kiểm tra thông tin";
      setAddressMessage({ type: "error", text: message });
      return;
    }
    setIsAddressSaving(true);
    try {
      await accountAPI.saveAddress(parsed.data, editingAddressId ?? undefined);
      setAddressMessage({
        type: "success",
        text: editingAddressId
          ? "Địa chỉ đã được cập nhật"
          : "Địa chỉ đã được thêm",
      });
      await loadAddresses();
      // Close modal after successful save
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu địa chỉ";
      setAddressMessage({ type: "error", text: message });
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      name: address.name ?? "",
      phone: address.phone ?? "",
      company: address.company ?? "",
      addressLine: address.addressLine ?? "",
      province: address.province ?? "",
      district: address.district ?? "",
      ward: address.ward ?? "",
    });
    setEditingAddressId(address.id);
    openModal();
  };

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await accountAPI.deleteAddress(id);
      setAddressMessage({ type: "success", text: "Địa chỉ đã được xóa" });
      await loadAddresses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa địa chỉ";
      setAddressMessage({ type: "error", text: message });
    }
  };

  if (!token) return null;

  return (
    <section className={styles.accountCard} id="address-section">
      <div className={styles.accountAddresses}>
        {addressesLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải danh sách địa chỉ…</p>
          </div>
        ) : addresses.length > 0 ? (
          <ul className={styles.accountAddressesList}>
            {addresses.map((address) => (
              <li key={address.id} className={styles.accountAddressItem}>
                <div className={styles.addressInfo}>
                  <p className={styles.accountAddressMeta}>
                    <strong>{address.name}</strong> · {address.phone}
                  </p>
                  {address.company && (
                    <p className={styles.accountAddressCompany}>
                      {address.company}
                    </p>
                  )}
                  <p className={styles.accountAddressLine}>
                    {address.addressLine}, {address.ward}, {address.district},{" "}
                    {address.province}
                  </p>
                </div>
                <div className={styles.accountAddressActions}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => handleEditAddress(address)}
                    title="Sửa địa chỉ"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteAddress(address.id)}
                    title="Xóa địa chỉ"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <p>Bạn chưa thêm địa chỉ nào.</p>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleAddNewAddress}
            >
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>
                {editingAddressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
              >
                <FiX />
              </button>
            </div>

            {addressMessage && (
              <p
                className={`${styles.accountStatus} ${getStatusVariantClass(
                  addressMessage.type,
                )}`}
              >
                {addressMessage.text}
              </p>
            )}

            <form className={styles.modalForm} onSubmit={handleAddressSubmit}>
              <div className={styles.accountFormGrid}>
                <label>
                  <span>Người nhận *</span>
                  <input
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    placeholder="Tên người nhận"
                    required
                  />
                </label>
                <label>
                  <span>Điện thoại *</span>
                  <input
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    placeholder="0912345678"
                    required
                  />
                </label>
                <label className={styles.fullWidth}>
                  <span>Công ty (tùy chọn)</span>
                  <input
                    name="company"
                    value={addressForm.company}
                    onChange={handleAddressChange}
                    placeholder="Tên công ty, nếu có"
                  />
                </label>
                <label className={styles.fullWidth}>
                  <span>Địa chỉ chi tiết *</span>
                  <input
                    name="addressLine"
                    value={addressForm.addressLine}
                    onChange={handleAddressChange}
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </label>
                <label>
                  <span>Phường/Xã *</span>
                  <input
                    name="ward"
                    value={addressForm.ward}
                    onChange={handleAddressChange}
                    placeholder="Phường Bến Nghé"
                    required
                  />
                </label>
                <label>
                  <span>Quận/Huyện *</span>
                  <input
                    name="district"
                    value={addressForm.district}
                    onChange={handleAddressChange}
                    placeholder="Quận 1"
                    required
                  />
                </label>
                <label className={styles.fullWidth}>
                  <span>Tỉnh/Thành phố *</span>
                  <input
                    name="province"
                    value={addressForm.province}
                    onChange={handleAddressChange}
                    placeholder="TP. Hồ Chí Minh"
                    required
                  />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                  disabled={isAddressSaving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={isAddressSaving}
                >
                  {isAddressSaving
                    ? "Đang lưu..."
                    : editingAddressId
                      ? "Cập nhật"
                      : "Lưu địa chỉ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className={styles.accountCardHeader}>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddNewAddress}
        >
          <FiPlus />
          <span>Thêm địa chỉ</span>
        </button>
      </div>
    </section>
  );
};

export default AddressSection;
